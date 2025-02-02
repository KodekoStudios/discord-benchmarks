const { Chart, registerables } = require('chart.js');
const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// Registrar todos los elementos de Chart.js
Chart.register(...registerables);

// Directorio donde están los archivos JSON
const resultsDir = './results';

// Colores personalizados para las librerías
const libraryColors = [
    '#FF6B6B', // Coral
    '#4ECDC4', // Turquesa
    '#45B7D1', // Celeste
    '#96CEB4', // Verde menta
    '#FFEEAD', // Amarillo pastel
    '#D4A5A5', // Rosa antiguo
    '#9370DB', // Violeta medio
    '#20B2AA', // Verde mar claro
];

// Función para limpiar y parsear el contenido de los archivos
function cleanAndParseJSON(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.endsWith("]")) {
        content = content + "]";
    }
    content = content.replace(/,\s*]/g, ']');
    return JSON.parse(content);
}

// Función para calcular promedios y convertir a MB
function getAverageMetrics(filePath) {
    const data = cleanAndParseJSON(filePath);
    const metrics = {
        heapUsed: 0,
        heapTotal: 0,
        rss: 0,
        cpuSystem: 0,
    };

    data.forEach((item) => {
        metrics.heapUsed += item.heapUsed;
        metrics.heapTotal += item.heapTotal;
        metrics.rss += item.rss;
        metrics.cpuSystem += item.cpuSystem;
    });

    const entries = Object.entries(metrics);
    entries.forEach(([key, value]) => (metrics[key] = value / data.length / (1024 * 1024)));
    return metrics;
}

// Leer todos los archivos JSON y calcular promedios por librería
const libraries = fs.readdirSync(resultsDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
        const libraryName = file.replace('.json', '');
        const averages = getAverageMetrics(path.join(resultsDir, file));
        return { libraryName, ...averages };
    });

// Configuración de las métricas
const metricsConfig = {
    heapUsed: {
        title: 'Heap Used por Librería',
        description: 'Memoria heap utilizada en MB',
        gradient: ['#FF6B6B', '#EE5253'],
    },
    heapTotal: {
        title: 'Heap Total por Librería',
        description: 'Memoria heap total asignada en MB',
        gradient: ['#4ECDC4', '#45B7AF'],
    },
    cpuSystem: {
        title: 'CPU (System) por Librería',
        description: 'Tiempo de CPU en segundos',
        gradient: ['#4ECDC4', '#45B7AF'],
    },
    rss: {
        title: 'RSS por Librería',
        description: 'Resident Set Size en MB',
        gradient: ['#45B7D1', '#3CA2BA'],
    },
};

// Función para crear un degradado en el canvas
function createGradient(ctx, colors) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    return gradient;
}

// Función para crear un gráfico individual
function createChart(metric, labels, data, canvas) {
    const ctx = canvas.getContext('2d');
    const config = metricsConfig[metric];
    const gradient = createGradient(ctx, config.gradient);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: config.description,
                    data,
                    backgroundColor: labels.map((_, index) => libraryColors[index % libraryColors.length]),
                    borderColor: labels.map((_, index) => libraryColors[index % libraryColors.length]),
                    borderWidth: 1,
                    borderRadius: 8,
                    maxBarThickness: 50,
                },
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: config.title,
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                    padding: 20,
                },
                subtitle: {
                    display: true,
                    text: config.description,
                    font: {
                        size: 14,
                        style: 'italic',
                    },
                    padding: {
                        bottom: 20,
                    },
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#000',
                    bodyColor: '#000',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 6,
                    callbacks: {
                        label: function (context) {
                            return `${context.raw.toFixed(2)} MB`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false,
                    },
                    ticks: {
                        callback: (value) => `${value} MB`,
                        font: {
                            size: 12,
                        },
                        padding: 10,
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            size: 12,
                        },
                        padding: 5,
                    },
                },
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart',
            },
        },
    });
}

// Crear gráficos separados para cada métrica
const metrics = ['heapUsed', 'heapTotal', 'rss', 'cpuSystem'];
const labels = libraries.map((lib) => lib.libraryName);

metrics.forEach((metric) => {
    // Crear un canvas más grande para mejor calidad
    const canvas = createCanvas(1000, 600);

    createChart(
        metric,
        labels,
        libraries.map((lib) => lib[metric]),
        canvas
    );

    // Guardar cada gráfica como imagen PNG
    const outputPath = `./public/comparison_chart_${metric}.png`;
    fs.writeFileSync(outputPath, canvas.toBuffer('image/png'));
    console.log(`Gráfica de ${metric} guardada como ${outputPath}`);
});