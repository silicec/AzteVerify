const { EmbedBuilder } = require("discord.js");
const { executeQuery } = require("../database.js"); 

module.exports = {
    name: 'activitate',
    description: 'View admin activity',
    async execute(interaction) {
        const allowedUserIds = ['1167832049676210226', '1152659871678873600', '1218662169391136808', '1204183913010823229', '1099255105083158569'];
        
        // Check if the user is allowed to use the command
        if (!allowedUserIds.includes(interaction.user.id)) {
            await interaction.reply({ content: 'Nu ai permisiunea de a utiliza această comandă.', ephemeral: true });
            return;
        }

        try {
            // Query to fetch all admin timeout counts from the database
            const query = 'SELECT admin_id, timeout_count FROM ActivitateAdmin';
            const results = await executeQuery(query);

            // Build an embed response
            const embed = new EmbedBuilder()
                .setTitle('Activitate Admini')
                .setColor('#0099ff');

            // Add fields to embed
            if (results.length > 0) {
                results.forEach(result => {
                    embed.addFields({ name: `<@${result.admin_id}>`, value: `Timeouts: ${result.timeout_count}`, inline: true });
                });
            } else {
                embed.setDescription('Nu există activitate înregistrată.');
            }

            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error("Database error fetching admin activity:", error);
            await interaction.reply({ content: 'A apărut o eroare la preluarea datelor din baza de date.', ephemeral: true });
        }
    }
};
