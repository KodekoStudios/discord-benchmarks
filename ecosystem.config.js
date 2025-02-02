require('dotenv').config();

module.exports = {
    apps: [
        // Bot de discord.js
        {
            name: 'discord.js',
            script: './src/libraries/discord.js',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TOKEN: process.env.TOKEN,
            },
        },
        // Bot de Eris
        {
            name: 'eris',
            script: './src/libraries/eris.js',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TOKEN: process.env.TOKEN,
            },
        },
        // Bot de Oceanic
        {
            name: 'oceanic',
            script: './src/libraries/oceanic.js',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TOKEN: process.env.TOKEN,
            },
        },
        // Bot de Kodkord
        {
            name: 'kodkord',
            script: './src/libraries/kodkord.js',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TOKEN: process.env.TOKEN,
            },
        },
        // Bot de Seyfert
        {
            name: 'seyfert',
            script: './src/libraries/seyfert.js',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TOKEN: process.env.TOKEN,
            },
        },
        // Bot de Detritus Client
        {
            name: 'detritus_client',
            script: './src/libraries/detritus-client.js',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TOKEN: process.env.TOKEN,
            },
        },
        // Bot de discord.py
        {
            interpreter: './.venv/bin/python3.12', // Especificar el intérprete de Python
            script: './src/libraries/discord-py.py',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TOKEN: process.env.TOKEN,
            },
        },
        // Script de monitoreo
        {
            name: 'monitor',
            script: './src/monitor.js',
            env: {
                INTENTS: process.env.INTENTS || '53608447',
                TIME: process.env.TIME || '3600000', // Duración del benchmark (1 hora por defecto)
            },
        },
    ],
};