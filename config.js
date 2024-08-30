module.exports = {
    server: {
        domain: "localhost",
        https: false,
        httpPort: 8080,
    },

    Discord: {
        // —— Things that are required for the whole project to work.
        token: "MTI3OTAzNjc4NzE3NTQ2MDg5NQ.G6MFEc.bG526fD08SWyRKDKrun7KvdlIa1Lq9SJSDvVhw", // —— Bot token.
        botId: "1279036787175460895", // —— Bot ID.
        guildId: "1099254930075832330", // —— Server id.
        verifiedRole: "1099255114549694605", // —— Aici e rolu verificat.
        
        // —— Set the bot's presence, for statusType see: https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType
        statusType: 3, // 1 (STREAMING), 2 (LISTENING), 3 (WATCHING), 5 (COMPETING). Default is 0 (PLAYING). 
        statusMsg: "Caut useri neverificati!",

    },

    reCAPTCHA: {
        secretKey: "",
        publicKey: ""
    }
}
