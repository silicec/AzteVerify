// public/slash/misc/informatii.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dragos')
        .setDescription('Il streseaza pe Dragos, regele nostru'),

    async execute(interaction) {


        // Dragos user ID
        const dragosUserId = '252394013464854528'; // Replace with Bogdan's actual Discord user ID

        // Create the embedded message
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Dragos este seful tuturor')
            .setDescription(
                `- **Eu sunt fetita lui <@${dragosUserId}> pentru ca mi-am permis sa il deranjez!**`
            );

        // Send the embedded message
        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
