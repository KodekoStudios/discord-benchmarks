const { Client, Options } = require('discord.js');

sendMemoryUsage();

const client = new Client({
    shardCount: 3,
    intents: Number(process.env.INTENTS),
    makeCache: Options.cacheWithLimits({
        ApplicationCommandManager: 0,
        AutoModerationRuleManager: 0,
        BaseGuildEmojiManager: 0,
        DMMessageManager: 0,
        GuildBanManager: 0,
        GuildEmojiManager: 0,
        GuildForumThreadManager: 0,
        GuildInviteManager: 0,
        GuildMemberManager: 0,
        GuildMessageManager: 0,
        GuildScheduledEventManager: 0,
        GuildStickerManager: 0,
        GuildTextThreadManager: 0,
        MessageManager: 0,
        PresenceManager: 0,
        ReactionManager: 0,
        ReactionUserManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        UserManager: 0,
        VoiceStateManager: 0,
        // cannot disable guilds, roles, and channels cache
    })
});

client.on('ready', () => {
    console.log(`[discord.js] Logged in as Discord.js!`);
});

client.login(process.env.TOKEN);

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
