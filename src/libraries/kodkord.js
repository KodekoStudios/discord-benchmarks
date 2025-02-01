const { Client } = require('kodkord');

sendMemoryUsage();

const client = new Client({
    token: process.env.TOKEN,
    intents: Number(process.env.INTENTS),
});

client.shards.create(3);

client.events.set('READY', (user) => {
    console.log(`[kodkord] Logged in as Kodkord!`);
});

client.connect();

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
