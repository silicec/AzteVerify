// public/slash/misc/informatii.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bogdan')
        .setDescription('Il streseaza pe Bogdan, regele nostru'),

    async execute(interaction) {


        // Bogdan's user ID
        const bogdanUserId = '333654326377447425'; // Replace with Bogdan's actual Discord user ID

        // Create the embedded message
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bogdan este seful tuturor')
            .setDescription(
                `- **Eu sunt fetita lui <@${bogdanUserId}> pentru ca mi-am permis sa il deranjez!**`
            );

        // Send the embedded message
        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
