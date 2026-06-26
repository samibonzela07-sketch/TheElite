const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/database');
const config = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('View all the legendary items and fruits inside your Capsule Corp storage.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userProfile = db.getUser(userId);

        // Check if the user actually has items
        let inventoryList = "🎒 Your storage is completely empty! Go work or train to find items.";
        
        if (userProfile.inventory && userProfile.inventory.length > 0) {
            // Count identical items together (e.g., "2x Tiger Fruit" instead of listing it twice)
            const counts = {};
            userProfile.inventory.forEach(item => {
                counts[item] = (counts[item] || 0) + 1;
            });
            
            inventoryList = Object.entries(counts)
                .map(([item, count]) => `• **${item}** x${count}`)
                .join('\n');
        }

        // Build a sleek backpack summary interface
        const inventoryEmbed = new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle(`🎒 ${interaction.user.username}'s Inventory Bag`)
            .setDescription(inventoryList)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: config.status });

        await interaction.reply({ embeds: [inventoryEmbed] });
    },
};
