const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pingrole')
        .setDescription('Add or remove a role using buttons.')
        .setDefaultMemberPermissions(0) // No default permissions; will manage manually
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The channel where the buttons should appear')
                .setRequired(true)) // User must select a channel
        .setDMPermission(false), // Command cannot be used in DMs
    async execute(interaction) {
        // Check if the user has one of the required roles
        const allowedRoles = [
            '1167832049676210226',
            '1152659871678873600',
            '1218662169391136808',
            '1204183913010823229',
            '1099255105083158569'
        ];

        const hasPermission = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));
        if (!hasPermission) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the selected channel
        const channel = interaction.options.getChannel('channel');

        // Create buttons for giving and removing the role
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('give_role')
                    .setLabel('Pornire Notificari Daily Polls')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('remove_role')
                    .setLabel('Oprire Notificari Daily Polls')
                    .setStyle(ButtonStyle.Danger)
            );

        try {
            // Send the buttons to the selected channel
            await channel.send({
                content: 'Alege daca doresti notificare atunci cand postam un nou Daily Poll!',
                components: [row],
            });

            // Reply once to the user, indicating success
            await interaction.reply({ content: `Buttons have been sent to ${channel}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while sending the buttons to the channel.', ephemeral: true });
        }
    },
};
