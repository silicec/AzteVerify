const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panou")
        .setDescription("Sends a verification button to the specified channel")
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the verification button')
                .setRequired(true)
        ),

    async execute(interaction) {
        const allowedRoles = [
            '1167832049676210226', 
            '1152659871678873600', 
            '1218662169391136808', 
            '1204183913010823229', 
            '1099255105083158569'
        ]; // List of allowed role IDs

        const memberRoles = interaction.member.roles.cache;

        // Check if the member has at least one of the allowed roles
        if (!allowedRoles.some(role => memberRoles.has(role))) {
            await interaction.reply({ content: 'You do not have the required role to use this command.', ephemeral: true });
            return;
        }

        const channel = interaction.options.getChannel('channel');

        // Create a button for verification
        const button = new ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('Apasa aici pentru a te verifica')
            .setStyle(1); // PRIMARY style

        const actionRow = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Verificare cont')
            .setDescription('Apasa butonul de mai jos pentru a verifica contul tau.');

        try {
            await channel.send({ embeds: [embed], components: [actionRow] });
            await interaction.reply({ content: 'Verification button sent!', ephemeral: true });
        } catch (error) {
            console.error('Error sending verification button:', error);
            await interaction.reply({ content: 'Failed to send the verification button.', ephemeral: true });
        }
    }
};
