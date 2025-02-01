require('dotenv').config();

const pm2 = require('pm2');
const fs = require('fs');
const path = require('path');

const benchmarkDuration = parseInt(process.env.TIME || '3600000'); // Duración del benchmark
const resultsDir = path.join(__dirname, '../results');

// Crear la carpeta "results" si no existe
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

// Conectar a PM2
pm2.connect((err) => {
    if (err) {
        console.error('[Monitor] Error connecting to PM2:', err);
        process.exit(1);
    }

    console.log('[Monitor] Connected to PM2');

    // Objeto para almacenar la posición del archivo de log de cada proceso
    const filePositions = {};

    // Función para monitorear los procesos
    const monitorProcesses = () => {
        pm2.list((err, processes) => {
            if (err) {
                console.error('[Monitor] Error listing processes:', err);
                return;
            }

            processes.forEach((proc) => {
                if (proc.name !== 'monitor') { // Ignorar el proceso de monitoreo
                    // Obtener la ruta del archivo de log de salida
                    const logFilePath = path.join(resultsDir, `${proc.name}.json`);

                    // Inicializar el archivo de resultados como un array si no existe
                    if (!fs.existsSync(logFilePath)) {
                        fs.writeFileSync(logFilePath, '[]');
                    }

                    // Leer la salida de la consola
                    pm2.describe(proc.name, (err, procDetails) => {
                        if (err) {
                            console.error(`[Monitor] Error getting details for ${proc.name}:`, err);
                            return;
                        }

                        const logPath = procDetails[0].pm2_env?.pm_out_log_path;
                        if (!logPath || !fs.existsSync(logPath)) {
                            console.error(`[Monitor] Log file not found for ${proc.name}`);
                            return;
                        }

                        // Obtener la posición actual del archivo de log
                        const stats = fs.statSync(logPath);
                        const fileSize = stats.size;

                        // Inicializar la posición si no existe
                        if (!filePositions[proc.name]) {
                            filePositions[proc.name] = fileSize; // Ignorar logs antiguos
                        }

                        // Leer solo las líneas nuevas
                        if (fileSize > filePositions[proc.name]) {
                            const stream = fs.createReadStream(logPath, {
                                start: filePositions[proc.name],
                                end: fileSize,
                            });

                            let buffer = '';
                            stream.on('data', (chunk) => {
                                buffer += chunk.toString();
                            });

                            stream.on('end', () => {
                                const lines = buffer.split('\n');
                                lines.forEach((line) => {
                                    if (line.trim() !== '' && line.startsWith('{')) {
                                        try {
                                            const metrics = JSON.parse(line);

                                            // Crear la entrada de log
                                            const logEntry = {
                                                timestamp: new Date().toISOString(),
                                                name: proc.name,
                                                ...metrics,
                                            };

                                            // Leer el archivo de resultados actual
                                            const currentData = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));

                                            // Añadir la nueva entrada al array
                                            currentData.push(logEntry);

                                            // Escribir el array actualizado en el archivo de resultados
                                            fs.writeFileSync(logFilePath, JSON.stringify(currentData, null, 2));
                                        } catch (error) {
                                            console.error(`[Monitor] Error parsing metrics for ${proc.name}:`, error);
                                        }
                                    }
                                });

                                // Actualizar la posición del archivo
                                filePositions[proc.name] = fileSize;
                            });
                        }
                    });
                }
            });
        });
    };

    // Monitorear los procesos cada 2 segundos
    const interval = setInterval(monitorProcesses, 2000);

    // Detener el benchmark después del tiempo especificado
    setTimeout(() => {
        clearInterval(interval);
        console.log(`[Monitor] Benchmark completed after ${benchmarkDuration / 1000} seconds.`);
        pm2.disconnect(); // Desconectar de PM2
        process.exit(0); // Detener el proceso
    }, benchmarkDuration);
});
