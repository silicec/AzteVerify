// —— Requiring the packages that we need.
const fs = require("fs");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Signale } = require('signale');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const express = require('express');
const path = require('path');
const axios = require('axios');
const https = require('https');
const pool = require('./pool');
const config = require("./config.js");
const logger = new Signale({ scope: 'Discord' });

// —— Initializing the client.
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
})

// —— Listening to messages to capture timeout events
client.on('messageCreate', async (message) => {
    // Log the message content for debugging
    console.log(`Message received in channel: ${message.channel.id}`);
    console.log(`Message content: ${message.content}`);

    // Check if the message is in the specific channel and sent by the bot
    if (message.channel.id === '1186580124334833715' && message.author.bot) {
        // Log to verify the message source
        console.log("Message is from the bot in the correct channel.");

        // Extract the admin's name from the message content
        const adminName = extractAdminName(message.content);

        // Log the extracted admin name
        console.log(`Extracted admin name: ${adminName}`);

        // If admin name is found, update their command usage count in the database
        if (adminName) {
            console.log(`Attempting to update command count for admin: ${adminName}`);
            await incrementAdminCommandCount(adminName);
        } else {
            console.log("Admin name could not be extracted.");
        }
    } else {
        console.log("Message is not from the bot or in the wrong channel.");
    }
});

// Function to extract admin's name from the message content
function extractAdminName(messageContent) {
    // Split the message by new lines
    const lines = messageContent.split('\n');

    // Find the line containing "By Staff Member"
    const staffMemberIndex = lines.findIndex(line => line.includes("By Staff Member"));

    // If the line exists and the next line contains the admin's name, return it
    if (staffMemberIndex !== -1 && lines[staffMemberIndex + 1]) {
        return lines[staffMemberIndex + 1].trim();
    }

    // Return null if no admin name was found
    return null;
}

// Function to increment the admin's command usage count in the database
async function incrementAdminCommandCount(adminName) {
    const query = `
        INSERT INTO admin_command_usage (admin_name, command_count)
        VALUES (?, 1)
        ON DUPLICATE KEY UPDATE command_count = command_count + 1;
    `;

    try {
        // Log the query execution
        console.log(`Executing query for admin: ${adminName}`);
        await pool.executeQuery(query, [adminName]);  // Assuming the pool export provides executeQuery
        console.log(`Updated command count for admin: ${adminName}`);
    } catch (error) {
        console.error(`Failed to update command count for ${adminName}:`, error);
    }
}

// —— All event files of the event handler.
const eventFiles = fs
.readdirSync("./events")
.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
 const event = require(`./events/${file}`);
 if (event.once) {
     client.once(event.name, (...args) => event.execute(...args, client));
 } else {
     client.on(event.name, async (...args) => await event.execute(...args, client));
 }
}

client.slashCommands = new Collection();

// —— Registration of Slash-Command Interactions.
const slashCommands = fs.readdirSync("./public/slash");

for (const module of slashCommands) {
    const commandFiles = fs
        .readdirSync(`./public/slash/${module}`)
        .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
        const command = require(`./public/slash/${module}/${commandFile}`);
        client.slashCommands.set(command.data.name, command);
    }
}

// —— Registration of Slash-Commands in Discord API
const rest = new REST({ version: "9" }).setToken(config.Discord.token);

const commandJsonData = [
    ...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
];

(async () => {
    try {
        logger.success("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationGuildCommands(config.Discord.botId, config.Discord.guildId), { body: commandJsonData });
        logger.success("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

async function addRole(userID) {
    try {
        const guild = await client.guilds.fetch(config.Discord.guildId),
             role = await guild.roles.fetch(config.Discord.verifiedRole),
             member = await guild.members.fetch(userID);

        member.roles.add(role)
            .catch(() => {
                logger.error(`Failed to add role to user ${member.user.tag}! (Maybe verified role is above bot role?)`);
                return;
            })
            .then(() => {
                logger.info(`Added verified role to user ${member.user.tag}.`);
            })
    } catch (e) {
        console.log(e)
        logger.error(`Failed to add role to user ${userID}!`);
    }
}

async function removeRole(userID) {
    const removeRole = config.Discord.removeRole

    if(removeRole) {
        try {
            const guild = await client.guilds.fetch(config.Discord.guildId),
                 removeRoleId = await guild.roles.fetch(config.Discord.removeRoleId),
                 member = await guild.members.fetch(userID);

            member.roles.remove(removeRoleId)
                .catch(() => {
                    logger.error(`Failed to remove role from user ${member.user.tag}! (Maybe role is above bot role?)`);
                    return;
                })
                .then(() => {
                    logger.info(`Removed role from user ${member.user.tag}.`);
                })
            
        } catch(e) {
            logger.error(`Failed to remove role from user ${userID}!`);
        }
    } else {
        logger.info(`Remove role is set to false, step skipped.`)
    }  
}

// —— Login into your client application with bot's token.
client.login(config.Discord.token)
    .catch(() => {
        logger.fatal('Failed to login! Is your intents enabled?');
        process.exit(0);
    })

// —— And another thingy.
const app = express(),
     port = config.server.https ? 443 : config.server.httpPort;

// —— Middleware to log IP addresses
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get client IP
    const log = `${new Date().toISOString()} - IP: ${ip} - URL: ${req.originalUrl}\n`;

    // Log to the console
    console.log(log);

    // Optionally, log to a file
    fs.appendFileSync(path.join(__dirname, 'access.log'), log);

    next();
});

// —— Define render engine and assets path
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/assets')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET /verify/id
app.get('/verify/:verifyId?', (req, res) => {
    if (!req.params.verifyId) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));
    if (!pool.isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));
    res.render(path.join(__dirname, '/html/verify.html'), { publicKey: config.reCAPTCHA.publicKey });
});

// POST /verify/id
app.post('/verify/:verifyId?', async (req, res) => {
    if (!req.body || !req.body['g-recaptcha-response']) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));

    const response = await axios({
        method: 'post',
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${config.reCAPTCHA.secretKey}&response=${req.body['g-recaptcha-response']}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (!response.data.success) return res.sendFile(path.join(__dirname, '/html/invalidCaptcha.html'));
    if (!pool.isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));
    await addRole(pool.getDiscordId(req.params.verifyId));
    await removeRole(pool.getDiscordId(req.params.verifyId));
    pool.removeLink(req.params.verifyId);
    res.sendFile(path.join(__dirname, '/html/valid.html'));
});

const start = () => {
    if (config.https) {
        https.createServer({
            key: fs.readFileSync('private.pem'),
            cert: fs.readFileSync('certificate.pem')
        }, app).listen(port, () => logger.info(`Listening on port ${port}.`));
    } else {
        app.listen(port, () => logger.info(`Listening on port ${port}.`));
    }
}

// —— Start the server
start();
