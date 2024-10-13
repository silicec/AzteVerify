module.exports = {
    server: {
        domain: process.env.SERVER_DOMAIN,
        https: false,
        httpPort: 80,
    },

    Discord: {
        verificationLogChannelId: "1182719590774607922",
        token: process.env.DISCORD_TOKEN, // Use environment variable
        botId: process.env.DISCORD_BOT_ID, // Use environment variable
        guildId: "1099254930075832330",
        verifiedRole: "1099255114549694605",
        statusType: 3,
        statusMsg: "you",
        rulesEnabled: false,
    },

    reCAPTCHA: {
        secretKey: process.env.RECAPTCHA_SECRET, // Use environment variable
        publicKey: process.env.RECAPTCHA_PUBLIC // Use environment variable
    }
};
