const { EmbedBuilder } = require("discord.js");
const { executeQuery } = require("../../../database.js"); // Adjust the path according to your structure

module.exports = {
    name: 'activitate',
    description: 'Displays the number of timeouts issued by each admin.',
    async execute(interaction) {
        const allowedRoleIds = [
            '1167832049676210226', // Replace with your actual role IDs
            '1152659871678873600',
            '1218662169391136808',
            '1204183913010823229',
            '1099255105083158569',
        ];

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
                    embed.addFields({ name: `Admin ID: ${row.admin_id}`, value: `Timeout-uri emise: ${row.timeout_count}`, inline: true });
                });
            } else {
                embed.addFields({ name: 'Nicio activitate', value: 'Nu s-au emis timeout-uri.', inline: false });
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error("Error fetching activity data:", error);
            await interaction.reply({ content: 'A apărut o eroare la obținerea activității.', ephemeral: true });
        }
    }
};
