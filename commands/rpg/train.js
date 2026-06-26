const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/database');
const config = require('../../config/config');

// A tracker map to handle training cooldowns
const trainCooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('train')
        .setDescription('Push your limits and increase your Power Level!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const now = Date.now();
        const cooldownAmount = 45000; // 45 seconds in milliseconds

        // --- COOLDOWN CHECK ---
        if (trainCooldowns.has(userId)) {
            const expirationTime = trainCooldowns.get(userId) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                return interaction.reply({
                    content: `😓 Your muscles are torn! Let your body recover for **${timeLeft}s** before training again.`,
                    ephemeral: true
                });
            }
        }

        // Set cooldown
        trainCooldowns.set(userId, now);

        // Fetch profile
        const userProfile = db.getUser(userId);

        // Fun training scenarios
        const trainingRegimens = [
            { text: "You cranked up the Gravity Chamber to 100x and pushed through your limits!", min: 15, max: 40 },
            { text: "You spent hours meditating under a freezing waterfall to control your Ki.", min: 10, max: 30 },
            { text: "You went head-to-head sparring against a projection of Piccolo.", min: 20, max: 50 },
            { text: "You sprinted across Snake Way carrying heavy training weights.", min: 12, max: 35 }
        ];

        // Pick a random training style
        const regimen = trainingRegimens[Math.floor(Math.random() * trainingRegimens.length)];
        
        // Calculate the Power Level gain
        const gain = Math.floor(Math.random() * (regimen.max - regimen.min + 1)) + regimen.min;

        // Update Power Level in the database
        userProfile.powerLevel += gain;
        db.updateUser(userId, { powerLevel: userProfile.powerLevel });

        // Build a sleek Saiyan-themed layout box
        const trainEmbed = new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle(`🔥 Training Session Complete!`)
            .setDescription(`${regimen.text}\n\nYour **${config.levelName}** increased by **+${gain.toLocaleString()}**!`)
            .addFields({ name: `Total Strength`, value: `⚡ **${userProfile.powerLevel.toLocaleString()}**` })
            .setTimestamp()
            .setFooter({ text: config.status });

        await interaction.reply({ embeds: [trainEmbed] });
    },
};
