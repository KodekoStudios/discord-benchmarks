const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, '..', 'results');

// Función para leer los datos de un archivo JSON
function readBenchmarkData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

// Función para obtener los resultados de la benchmark
function getBenchmarkResults() {
    const files = fs.readdirSync(resultsDir).filter(file => file.endsWith('.json'));
    const benchmarks = {};

    files.forEach(file => {
        const filePath = path.join(resultsDir, file);
        const data = readBenchmarkData(filePath);
        if (data && Array.isArray(data)) {
            const libraryName = data[0]?.name || file.replace('.json', '');
            if (!benchmarks[libraryName]) {
                benchmarks[libraryName] = {
                    cpu: 0,
                    memory: 0,
                    heapUsed: 0,
                    heapTotal: 0,
                    rss: 0,
                    cpuUser: 0,
                    cpuSystem: 0,
                    count: 0,
                };
            }
            data.forEach(entry => {
                benchmarks[libraryName].cpu += entry.cpu || 0;
                benchmarks[libraryName].memory += entry.memory || 0;
                benchmarks[libraryName].heapUsed += entry.heapUsed || 0;
                benchmarks[libraryName].heapTotal += entry.heapTotal || 0;
                benchmarks[libraryName].rss += entry.rss || 0;
                benchmarks[libraryName].cpuUser += entry.cpuUser || 0;
                benchmarks[libraryName].cpuSystem += entry.cpuSystem || 0;
                benchmarks[libraryName].count += 1;
            });
        }
    });

    return benchmarks;
}

// Función para calcular los promedios
function calculateAverages() {
    const benchmarks = getBenchmarkResults();
    if (Object.keys(benchmarks).length === 0) {
        console.log('No benchmark data found.');
        return;
    }

    const averages = Object.entries(benchmarks).map(([name, data]) => ({
        Name: name,
        CPU: (data.cpu / data.count).toFixed(2) + ' %',
        Memory: ((data.memory / data.count) / (1024 * 1024)).toFixed(2) + ' MB',
        HeapUsed: ((data.heapUsed / data.count) / (1024 * 1024)).toFixed(2) + ' MB',
        HeapTotal: ((data.heapTotal / data.count) / (1024 * 1024)).toFixed(2) + ' MB',
        RSS: ((data.rss / data.count) / (1024 * 1024)).toFixed(2) + ' MB',
        CPUUser: ((data.cpuUser / data.count) / 1000).toFixed(2) + ' ms',
        CPUSystem: ((data.cpuSystem / data.count) / 1000).toFixed(2) + ' ms',
    }));

    console.log('Average Benchmark Results:');
    console.table(averages);
}

// Ejecutar la función para calcular y mostrar los promedios
calculateAverages();