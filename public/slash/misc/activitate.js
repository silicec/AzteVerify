// public/slash/misc/activitate.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { executeQuery } = require('../database.js'); // Adjust the import to your actual database module

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activitate')
        .setDescription('Afișează activitatea administratorilor.'),

    async execute(interaction) {
        // Allowed user IDs
        const allowedUserIds = [
            '1167832049676210226', 
            '1152659871678873600', 
            '1218662169391136808', 
            '1204183913010823229', 
            '1099255105083158569'
        ];

        // Check if the user is allowed to use this command
        if (!allowedUserIds.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'Nu ai permisiunea de a utiliza această comandă.', ephemeral: true });
        }

        // Query to get activity from the database
        const query = 'SELECT admin_id, timeout_count FROM ActivitateAdmin'; // Adjust according to your table structure

        try {
            const results = await executeQuery(query);
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Activitatea Administratorilor');

            if (results.length > 0) {
                results.forEach(result => {
                    embed.addFields({ name: `<@${result.admin_id}>`, value: `Timeouts: ${result.timeout_count}`, inline: true });
                });
            } else {
                embed.setDescription('Nu există activitate înregistrată.');
            }

            // Send the embedded message
            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error("Database error fetching admin activity:", error);
            await interaction.reply({ content: 'A apărut o eroare la preluarea datelor din baza de date.', ephemeral: true });
        }
    },
};
