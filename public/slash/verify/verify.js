const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const config = require("../../../config.js");
const pool = require("../../../pool.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verificare")
        .setDescription("Verify yourself in the server!"),

    async execute(interaction) {
        // Determine the domain to use in the verification URL
        const domain = config.server.domain === 'localhost' ? `${config.server.domain}:${config.server.httpPort}` : `${config.server.domain}`; 

        // Ensure the interaction is in a guild context and the member is fully fetched
        
        if (interaction.guild && interaction.member) {
            try {
                // Fetch the member to ensure their data is complete
                let member = (await interaction.guild.members.fetch({ user: interaction.user.id, force: true }));

                // Check if the member already has the verified role
                if (member.roles.cache.some(r => r.id === config.Discord.verifiedRole)) {
                    await interaction.reply({ content: 'You are already verified', ephemeral: true });
                    return;
                }
            } catch (error) {
                console.error("Error fetching member:", error);
                await interaction.reply({ content: 'An error occurred while fetching your member data.', ephemeral: true });
                return;
            }
        } else {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        // Create the button for agreeing to the rules
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("rules")
                .setLabel('Agree')
                .setEmoji('✅')
                .setStyle(1)
        );
        
        // Create the rules embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Rules')
            .setDescription("abc");
            
        // Verification process with reCAPTCHA
        if (config.Discord.rulesEnabled) {
            await interaction.reply({ content: 'Please check your DMs!', ephemeral: true });
            
            const linkID = pool.createLink(interaction.user.id);

            const captchaEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('reCAPTCHA Verification')
                .setDescription(`To gain access to this server you must solve a captcha. The link will expire in 15 minutes.\n${config.server.https ? 'https://' : 'http://'}${domain}/verify/${linkID}`);

            // Attempt to send a DM to the user
            try {
                const dm = await interaction.user.createDM();
                await dm.send({ embeds: [captchaEmbed] });
            } catch (error) {
                console.error("Failed to send captcha to user:", error);
                await interaction.followUp("Failed to send you a DM! Please check if your DMs are open.");
            }
        } else {
            await interaction.reply({ content: 'Please check your DMs!', ephemeral: true });

            const linkID = pool.createLink(interaction.user.id);

            const captchaEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('reCAPTCHA Verification')
                .setDescription(`To gain access to this server you must solve a captcha. The link will expire in 15 minutes.\n${config.server.https ? 'https://' : 'http://'}${domain}/verify/${linkID}`);

            // Attempt to send a DM to the user
            try {
                const dm = await interaction.user.createDM();
                await dm.send({ embeds: [captchaEmbed] });
            } catch (error) {
                console.error("Failed to send captcha to user:", error);
                await interaction.followUp("Failed to send you a DM! Please check if your DMs are open.");
            }
        }
    }
};
