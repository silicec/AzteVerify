const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('informatii')
        .setDescription('Displays server information and verification instructions.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel to post the information')
                .setRequired(true) // Makes channel selection mandatory
                .addChannelTypes(ChannelType.GuildText) // Ensure only text channels can be selected
        ),

    async execute(interaction) {
        // Define the roles that are allowed to use this command
        const allowedRoles = [
            '1167832049676210226', 
            '1152659871678873600', 
            '1218662169391136808', 
            '1204183913010823229', 
            '1099255105083158569'
        ];

        // Check if the user has any of the allowed roles
        const hasAllowedRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

        // If the user does not have the allowed role, send an error message
        if (!hasAllowedRole) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        // Get the selected channel from the command options
        const targetChannel = interaction.options.getChannel('channel');

        // Create the embedded message
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bine ai venit in Ordinul Templierilor Azteci')
            .setDescription(
                '✅ **Ca sa primesti acces la server trebuie sa apesi pe butonul verde de mai jos pe care scrie "Apasa aici pentru a te verifica", dupa o sa primesti un link in privat unde o sa te verifici , dupa ce ai terminat o sa primesti automat rol si acces la tot serverul.**\n\n' +
                '🔹 **FAQ**\n' +
                '- **De ce nu am primit mesaj in privat?**\n' +
                'Pentru ca nu ai dm-urile pornite, ca sa le pornesti trebuie sa te duci in: "User Settings > Privacy and Safety > Allow direct messages from server members" si sa pornesti optiunea.\n\n' +
                '- **De ce trebuie sa ma verific?**\n' +
                'Optiunea de verificare a fost implementata pentru securitatea serverului.\n\n' +
                '🔸 **Criterii pentru a te verifica**\n' +
                '- Trebuie sa ai un cont facut de minim 3 zile.\n' +
                '- Nu trebuie sa folosesti VPN.\n' +
                '- Nu trebuie sa ai conturi banate pe server.\n\n' +
                '- **Daca ai intalnit probleme pe timpul verificarii te rog sa il contactezi pe Gufi sau alt membru staff.**'
            );

        // Send the embedded message to the selected channel
        await targetChannel.send({ embeds: [embed] });

        // Acknowledge the command execution to the user who ran the command
        await interaction.reply({ content: `Information has been posted in ${targetChannel}.`, ephemeral: true });
    },
};
