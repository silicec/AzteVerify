const { executeQuery } = require('../../../db');  // Adjust path if needed

// List of allowed user IDs
const allowedUserIds = [
    '1167832049676210226',
    '1152659871678873600',
    '1218662169391136808',
    '1204183913010823229',
    '1099255105083158569'
];

module.exports = {
    name: 'activitate',
    description: 'View the admin timeout activity',
    async execute(interaction) {
        const userId = interaction.user.id;

        // Check if the user is allowed to execute the command
        if (!allowedUserIds.includes(userId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            // Query the database for timeout activity
            const results = await executeQuery('SELECT admin_id, timeout_count FROM ActivitateAdmin');
            
            // Format the results into a message
            let message = '**Admin Timeout Activity**\n\n';
            results.forEach(row => {
                message += `Admin ID: ${row.admin_id} | Timeouts: ${row.timeout_count}\n`;
            });

            // Send the result in the channel where the command was used
            await interaction.reply(message);
        } catch (error) {
            console.error('Error fetching activity:', error);
            await interaction.reply({ content: 'There was an error retrieving the data.', ephemeral: true });
        }
    }
};
