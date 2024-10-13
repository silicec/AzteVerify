const { EmbedBuilder } = require("discord.js");
const { executeQuery } = require("../../database.js"); // Adjust the path as necessary

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

            // Build a response message
            if (results.length > 0) {
                let responseMessage = 'Activitate Admini:\n\n';
                results.forEach(result => {
                    responseMessage += `<@${result.admin_id}> - Timeouts: ${result.timeout_count}\n`;
                });
                await interaction.reply({ content: responseMessage, ephemeral: false });
            } else {
                await interaction.reply({ content: 'Nu există activitate înregistrată.', ephemeral: false });
            }
        } catch (error) {
            console.error("Database error fetching admin activity:", error);
            await interaction.reply({ content: 'A apărut o eroare la preluarea datelor din baza de date.', ephemeral: true });
        }
    }
};
