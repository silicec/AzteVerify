const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config.js");
const pool = require("../pool.js");  // This is your database module for executing queries
const { executeQuery } = require("../database.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton() && !interaction.isCommand()) return; // Only handle button and command interactions

        // Retry function to handle retries on 503 errors
        async function retryOnFailure(fn, retries = 3, delay = 1000) {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    if (error.status === 503 && i < retries - 1) {
                        console.warn(`Service Unavailable, retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    } else {
                        throw error;
                    }
                }
            }
        }

        // Handle the verification button interaction
        if (interaction.customId === 'verify_button') {
            logVerificationAttempt(interaction, 'initiated');

            const domain = config.server.domain === 'localhost' ? `${config.server.domain}:${config.server.httpPort}` : `${config.server.domain}`;

            if (!interaction.guild || !interaction.member) {
                await retryOnFailure(() => interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true }));
                logVerificationAttempt(interaction, 'failed', 'Not in a guild context');
                return;
            }

            // Check if the user's account is newer than 3 days
            const accountCreationDate = interaction.user.createdAt;
            const accountAgeInDays = (Date.now() - accountCreationDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

            if (accountAgeInDays < 3) {
                await retryOnFailure(() => interaction.reply({ content: 'Trebuie sa ai contul creat de mai mult de 3 zile pentru a te putea verifica!', ephemeral: true }));
                logVerificationAttempt(interaction, 'failed', 'Account is newer than 3 days');
                return;
            }

            try {
                const member = await retryOnFailure(() => interaction.guild.members.fetch({ user: interaction.user.id, force: true }));

                if (member.roles.cache.some(r => r.id === config.Discord.verifiedRole)) {
                    await retryOnFailure(() => interaction.reply({ content: 'Esti deja verificat!', ephemeral: true }));
                    logVerificationAttempt(interaction, 'failed', 'Already verified');
                    return;
                }
            } catch (error) {
                console.error("Error fetching member:", error);
                await retryOnFailure(() => interaction.reply({ content: 'An error occurred while fetching your member data.', ephemeral: true }));
                logVerificationAttempt(interaction, 'failed', 'Error fetching member data');
                return;
            }

            const linkID = pool.createLink(interaction.user.id);
            const verificationURL = `${config.server.https ? 'https://' : 'http://'}${domain}/verify/${linkID}`;

            const captchaEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🔒 Verificare reCAPTCHA')
                .setDescription(`**Pentru a accesa server-ul, te rugam sa rezolvi captcha-ul din linkul de mai jos, pentru a ne asigura ca nu esti robot.**`)
                .addFields({
                    name: '🔗 Click aici pentru verificare',
                    value: `[**Apasă aici pentru verificare!**](${verificationURL})`,
                    inline: false
                });

            try {
                await retryOnFailure(() => interaction.reply({ embeds: [captchaEmbed], ephemeral: true }));
                logVerificationAttempt(interaction, 'sent captcha');
            } catch (error) {
                console.error("Failed to send verification link:", error);
                await retryOnFailure(() => interaction.followUp({ content: "A apărut o eroare în timpul trimiterii mesajului de verificare.", ephemeral: true }));
                logVerificationAttempt(interaction, 'failed', 'Failed to send ephemeral verification link');
            }
        }
        // Handle the /sex command
        else if (interaction.commandName === 'sex') {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
            .setCustomId('sex_m')
            .setLabel('👨')  // Emoji for M (male)
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('sex_f')
            .setLabel('👩')  // Emoji for F (female)
            .setStyle(ButtonStyle.Primary)
                );

            await retryOnFailure(() => interaction.reply({ content: 'Please choose your role:', ephemeral: true }));
            await retryOnFailure(() => interaction.followUp({ content: 'Click one of the buttons to choose your role:', components: [row] }));
        }

        // Handle button interactions for role assignment
        else if (interaction.customId === 'sex_m' || interaction.customId === 'sex_f') {
            const roleIdToAdd = interaction.customId === 'sex_m' ? '1281964247487610974' : '1281964421622792254'; // Role IDs for M and F
            const roleIdToRemove = interaction.customId === 'sex_m' ? '1281964421622792254' : '1281964247487610974'; // Opposite role ID
            const genderValue = interaction.customId === 'sex_m' ? 0 : 1; // Gender value for database (0 for male, 1 for female)

            try {
                const member = await retryOnFailure(() => interaction.guild.members.fetch({ user: interaction.user.id, force: true }));

                // Remove the opposite role
                await retryOnFailure(() => member.roles.remove(roleIdToRemove));

                // Add the selected role
                await retryOnFailure(() => member.roles.add(roleIdToAdd));

                const roleName = interaction.customId === 'sex_m' ? 'M' : 'F';
                await retryOnFailure(() => interaction.reply({ content: `Role '${roleName}' has been assigned to you!`, ephemeral: true }));

                // Update the database with the user's gender selection
                const updateQuery = 'UPDATE Users SET gender = ? WHERE userId = ?'; // Assuming your table is named 'users' and has 'gender' and 'userId' columns
                await executeQuery(updateQuery, [genderValue, interaction.user.id]);

            } catch (error) {
                console.error("Error assigning role or updating database:", error);
                await retryOnFailure(() => interaction.reply({ content: 'An error occurred while assigning the role or updating the database. Please try again later.', ephemeral: true }));
            }
        }

        // Handle the new role button interactions (your added code)
        if (interaction.isButton()) {
            const roleId = '1282322433398935624'; // Replace with the role ID you want to manage

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member) {
                return retryOnFailure(() => interaction.reply({ content: 'Member not found.', ephemeral: true }));
            }

            if (interaction.customId === 'give_role') {
                await retryOnFailure(() => member.roles.add(roleId));
                return retryOnFailure(() => interaction.reply({ content: 'Notificari Pornite!', ephemeral: true }));
            } else if (interaction.customId === 'remove_role') {
                await retryOnFailure(() => member.roles.remove(roleId));
                return retryOnFailure(() => interaction.reply({ content: 'Notificari Oprite!', ephemeral: true }));
            }
        }
    }
};

// Function to log verification attempts
async function logVerificationAttempt(interaction, status, reason = '') {
    const logChannel = interaction.guild.channels.cache.get(config.Discord.verificationLogChannelId);
    if (!logChannel) {
        console.error("Log channel not found. Please check the channel ID in the configuration.");
        return;
    }
    const embed = new EmbedBuilder()
        .setColor(status === 'failed' ? '#FF0000' : '#00FF00')
        .setTitle('Verificare in curs')
        .setDescription(`User ${interaction.user.tag} (${interaction.user.id}) has ${status} verification.`)
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
}
