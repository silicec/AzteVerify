const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sex')
        .setDescription('Choose your gender (M/F)')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel where you want to post the gender selection message')
                .setRequired(true)),  // Require the user to specify a channel
    async execute(interaction) {
        // Array of allowed role IDs
        const allowedRoles = [
            '1167832049676210226', 
            '1152659871678873600', 
            '1218662169391136808', 
            '1204183913010823229', 
            '1099255105083158569'
        ];

        // Check if the user has any of the allowed roles
        const hasRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

        if (!hasRole) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the selected channel from the interaction options
        const channel = interaction.options.getChannel('channel');

        // Create buttons
        const buttons = new ActionRowBuilder()
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

        // Create embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Choose Your Gender')
            .setDescription('Alege-ti sexul aici!');

        try {
            // Send the embed and buttons to the selected channel
            await channel.send({ embeds: [embed], components: [buttons] });
            
            // Let the user know the message has been successfully posted
            await interaction.reply({ content: `Gender selection message has been sent to ${channel}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while sending the message to the channel.', ephemeral: true });
        }
    }
};
