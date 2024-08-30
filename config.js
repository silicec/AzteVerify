module.exports = {
    server: {
        domain: "localhost",
        https: false,
        httpPort: 8080,
    },

    Discord: {
        // —— Things that are required for the whole project to work.
        token: "", // —— Bot token.
        botId: "", // —— Bot ID.
        guildId: "", // —— Server id.
        verifiedRole: "", // —— Aici e rolu verificat.
        
        // —— Set the bot's presence, for statusType see: https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType
        statusType: 3, // 1 (STREAMING), 2 (LISTENING), 3 (WATCHING), 5 (COMPETING). Default is 0 (PLAYING). 
        statusMsg: "unverified users!",

    },

    reCAPTCHA: {
        secretKey: "",
        publicKey: ""
    }
}
