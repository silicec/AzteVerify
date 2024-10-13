// public/slash/misc/activitate.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { executeQuery } = require('../database.js'); // Adjust the path if necessary

// Role IDs that can access the /activitate command
const allowedRoleIds = [
    '1167832049676210226', // Replace with your actual role IDs
    '1152659871678873600',
    '1218662169391136808',
    '1204183913010823229',
    '1099255105083158569',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activitate')
        .setDescription('Afiseaza activitatea staff-ului.'),

    async execute(interaction) {
        // Check if the user has one of the allowed roles
        const hasRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasRole) {
            return interaction.reply({ content: 'Nu ai permisiunea de a utiliza aceasta comanda.', ephemeral: true });
        }

        try {
            // Query to get the timeout counts
            const results = await executeQuery('SELECT * FROM ActivitateAdmin');

            // Create an embed message
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Activitatea Staff-ului')
                .setDescription('Numărul de timeout-uri emise de fiecare membru staff:')
                .setTimestamp();

            // Check if there are results
            if (results.length > 0) {
                results.forEach(row => {
                    embed.addFields({ name: `Admin ID: ${row.admin_id}`, value: `Timeout-uri emise: ${row.timeout_count}`, inline: false });
                });
            } else {
                embed.addFields({ name: 'Nici o activitate găsită', value: 'Nu au fost emise timeout-uri de către staff.', inline: false });
            }

            // Send the embed message
            await interaction.reply({ embeds: [embed], ephemeral: false });

        } catch (error) {
            console.error('Error fetching admin activity:', error);
            await interaction.reply({ content: 'A apărut o eroare la preluarea activității staff-ului', ephemeral: true });
        }
    },
};
