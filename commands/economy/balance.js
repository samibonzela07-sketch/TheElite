const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/database');
const config = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your current Zeni and Power Level!'),
    async execute(interaction) {
        // Grab the user who ran the command from our database filing cabinet
        const userProfile = db.getUser(interaction.user.id);

        // Build a beautiful visual box (Embed) to show their stats
        const balanceEmbed = new EmbedBuilder()
            .setColor(config.colors.economy)
            .setTitle(`📊 ${interaction.user.username}'s Scouter Profile`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `Pocket ${config.currency}`, value: `🪙 ${userProfile.zeni.toLocaleString()}`, inline: true },
                { name: `${config.bankName}`, value: `🏦 ${userProfile.bank.toLocaleString()}`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: false }, // Creates a clean blank spacing line
                { name: `💪 Current ${config.levelName}`, value: `🔥 **${userProfile.powerLevel.toLocaleString()}**`, inline: true },
                { name: `🏆 Combat Rank`, value: `⭐ Rank ${userProfile.rank}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: config.status });

        // Send the embed response back to the channel
        await interaction.reply({ embeds: [balanceEmbed] });
    },
};
