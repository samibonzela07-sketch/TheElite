const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/database');
const config = require('../../config/config');

// Define the items available for purchase in our universe shop
const SHOP_ITEMS = {
    tiger: { name: "Tiger Fruit", price: 1500, description: "A legendary fruit that unleashes feral combat power!" },
    weights: { name: "Weighted Gi", price: 800, description: "Heavy training clothes that increase passive stamina recovery." },
    scouter: { name: "Saiyan Scouter", price: 500, description: "A high-tech visor used to read opponent power levels instantly." }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Browse the Capsule Corp shop or buy a legendary item!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View all legendary items currently on sale.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('buy')
                .setDescription('Purchase a specific item from the storefront.')
                .addStringOption(option =>
                    option.setName('item')
                        .setDescription('The item key ID you want to purchase')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Tiger Fruit (1,500 Zeni)', value: 'tiger' },
                            { name: 'Weighted Gi (800 Zeni)', value: 'weights' },
                            { name: 'Saiyan Scouter (500 Zeni)', value: 'scouter' }
                        ))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const userProfile = db.getUser(userId);

        // --- SUBCOMMAND: VIEW SHOP ---
        if (subcommand === 'view') {
            const shopEmbed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle(`🏪 Capsule Corp Market Sector`)
                .setDescription(`Welcome to the marketplace! Use \`/shop buy item:<id>\` to purchase an item.\n\nYour Balance: 🪙 **${userProfile.zeni.toLocaleString()}** Zeni\n─`)
                .setTimestamp()
                .setFooter({ text: config.status });

            for (const [key, item] of Object.entries(SHOP_ITEMS)) {
                shopEmbed.addFields({
                    name: `🛒 ${item.name} (ID: \`${key}\`)`,
                    value: `Price: 🪙 **${item.price} Zeni**\n*${item.description}*\n─`
                });
            }

            return interaction.reply({ embeds: [shopEmbed] });
        }

        // --- SUBCOMMAND: BUY ITEM ---
        if (subcommand === 'buy') {
            const itemKey = interaction.options.getString('item');
            const selectedItem = SHOP_ITEMS[itemKey];

            // Safety check if something breaks
            if (!selectedItem) {
                return interaction.reply({ content: "❌ That item code does not exist in our inventories.", ephemeral: true });
            }

            // Wallet funds validation check
            if (userProfile.zeni < selectedItem.price) {
                return interaction.reply({
                    content: `❌ Missing funds! You need **${(selectedItem.price - userProfile.zeni).toLocaleString()}** more Zeni to buy the **${selectedItem.name}**.`,
                    ephemeral: true
                });
            }

            // Deduct money and update inventory lists
            userProfile.zeni -= selectedItem.price;
            
            // If inventory array doesn't exist yet, initialize it
            if (!userProfile.inventory) userProfile.inventory = [];
            userProfile.inventory.push(selectedItem.name);

            // Commit updates to the local database file system
            db.updateUser(userId, { 
                zeni: userProfile.zeni, 
                inventory: userProfile.inventory 
            });

            const buyEmbed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`🎉 Transaction Confirmed!`)
                .setDescription(`You successfully purchased a **${selectedItem.name}**!`)
                .addFields(
                    { name: 'Spent Funds', value: `🪙 -${selectedItem.price} Zeni`, inline: true },
                    { name: 'Remaining Wallet', value: `🪙 ${userProfile.zeni.toLocaleString()} Zeni`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.status });

            return interaction.reply({ embeds: [buyEmbed] });
        }
    },
};
