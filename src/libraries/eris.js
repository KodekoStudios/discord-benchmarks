const { Client } = require('eris');

sendMemoryUsage();

const client = new Client(
    `Bot ${process.env.TOKEN}`,
    {
        intents: Number(process.env.INTENTS),
        maxShards: 3,
        messageLimit: 0,
    });

client.channelGuildMap.limit = 0;
client.guilds.limit = 0;
client.dmChannelMap.limit = 0;
client.dmChannels.limit = 0;
client.unavailableGuilds.limit = 0;
client.users.limit = 0;

client.on('ready', () => {
    console.log(`[eris] Logged in as Eris!`);
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
