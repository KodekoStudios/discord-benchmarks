const { ClusterClient } = require('detritus-client');

sendMemoryUsage()

const client = new ClusterClient(
    `${process.env.TOKEN}`,
    {
        gateway: {
            intents: Number(process.env.INTENTS),
        },
        shardCount: 3,
        cache: {
            applications: false,
            channels: false,
            connectedAccounts: false,
            emojis: false,
            guilds: false,
            interactions: false,
            members: false,
            messages: false,
            notes: false,
            presences: false,
            relationships: false,
            roles: false,
            sessions: false,
            stageInstances: false,
            stickers: false,
            typings: false,
            users: false,
            voiceCalls: false,
            voiceConnections: false,
            voiceStates: false,
        }
    });

client.on('ready', () => {
    console.log(`[detritus-client] Logged in as Detritus!`);
});

client.on('messageCreate', (message) => {
    console.log(`[detritus-client] Message from ${message.author.username}: ${message.content}`);
    console.log(`[detritus-client] ${message.timestamp / 1000}s`);
});

client.run();

setInterval(sendMemoryUsage, 5000);

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
