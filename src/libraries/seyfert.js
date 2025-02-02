const { Client, MemoryAdapter } = require('seyfert');

function sendMemoryUsage() {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    console.log(JSON.stringify({
        heapUsed: usage.heapUsed,
        rss: usage.rss,
        heapTotal: usage.heapTotal,
        cpuUser: cpuUsage.user,
        cpuSystem: cpuUsage.system,
    }));
}

setInterval(sendMemoryUsage, 5000);

const client = new Client({
    shards: {
        start: 0,
        end: 3
    },
    getRC: () => {
        return {
            locations: {
                base: 'dist',
            },
            token: process.env.TOKEN,
            debug: false
        };
    }
});

client.setServices({
    cache: {
        disabledCache: {
            bans: true,
            channels: true,
            emojis: true,
            guilds: true,
            members: true,
            messages: true,
            overwrites: true,
            presences: true,
            roles: true,
            stageInstances: true,
            stickers: true,
            threads: true,
            users: true,
            voiceStates: true,
            onPacket: true,
        },
        adapter: new MemoryAdapter({
            encode(data) {
                return data;
            },
            decode(data) {
                return data;
            },
        })
    },
});

client.events.values.READY = {
    data: { name: 'ready' },
    run: () => {
        console.log(`[seyfert] Logged in as ${client.me.tag}`);
    }
};

client.events.values.MESSAGE_CREATE = {
    data: { name: 'messageCreate' },
    run: (message) => {
        console.log(`[seyfert] Message from ${message.author.tag}: ${message.content}`);
        console.log(`[seyfert] ${message.timestamp / 1000}s`);
    }
};


client.start({
    token: process.env.TOKEN,
    connection: {
        intents: Number(process.env.INTENTS),
    }
});