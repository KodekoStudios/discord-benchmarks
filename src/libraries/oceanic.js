const { Client } = require('oceanic.js');

sendMemoryUsage();

const client = new Client({
    auth: `Bot ${process.env.TOKEN}`,
    disableCache: false,
    gateway: { intents: Number(process.env.INTENTS) },
    collectionLimits: {
        messages: 0,
        auditLogEntries: 0,
        autoModerationRules: 0,
        channels: 0,
        emojis: 0,
        groupChannels: 0,
        guilds: 0,
        guildThreads: 0,
        integrations: 0,
        invites: 0,
        members: 0,
        privateChannels: 0,
        roles: 0,
        scheduledEvents: 0,
        stageInstances: 0,
        stickers: 0,
        unavailableGuilds: 0,
        users: 0,
        voiceMembers: 0,
        voiceStates: 0,
    }
});

client.on('ready', () => {
    console.log(`[oceanic.js] Logged in as Oceanic!`);
});

client.on('messageCreate', (message) => {
    console.log(`[oceanic.js] Message from ${message.author.username}: ${message.content}`);
    console.log(`[oceanic.js] ${message.timestamp / 1000}s`);
});

client.connect();

client.on('error', () => {
    //
});

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
