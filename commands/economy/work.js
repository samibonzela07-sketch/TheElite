const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/database');
const config = require('../../config/config');

// A smart map to keep track of who is on a work cooldown
const workCooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work a job in the universe to earn some Zeni!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const now = Date.now();
        const cooldownAmount = 30000; // 30 seconds in milliseconds

        // --- COOLDOWN CHECK ---
        if (workCooldowns.has(userId)) {
            const expirationTime = workCooldowns.get(userId) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                return interaction.reply({
                    content: `⏳ Your stamina is depleted! Rest for **${timeLeft}s** before working again.`,
                    ephemeral: true
                });
            }
        }

        // Set the cooldown timestamp for the user
        workCooldowns.set(userId, now);

        // Fetch their current profile
        const userProfile = db.getUser(userId);

        // Define a list of fun Dragon Ball themed jobs and descriptions
        const jobs = [
            { text: "You helped Goku harvest giant radishes on his farm.", min: 50, max: 150 },
            { text: "You assisted Bulma with building a new capsule prototype.", min: 100, max: 250 },
            { text: "You delivered heavy crates of milk training under Master Roshi.", min: 40, max: 120 },
            { text: "You cleaned up the path around King Kai's planet.", min: 60, max: 180 },
            { text: "You safely guarded Hercule Satan's trophy room from fans.", min: 80, max: 200 }
        ];

        // Pick a random job from our list
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        
        // Calculate a random reward payout between the minimum and maximum limits
        const payout = Math.floor(Math.random() * (randomJob.max - randomJob.min + 1)) + randomJob.min;

        // Update their Zeni wallet in the database filing cabinet
        userProfile.zeni += payout;
        db.updateUser(userId, { zeni: userProfile.zeni });

        // Build a gorgeous confirmation box
        const workEmbed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(`💼 Shift Complete!`)
            .setDescription(`${randomJob.text}\n\nYou earned **+${payout} ${config.currency}**!`)
            .addFields({ name: `Total Wallet`, value: `🪙 ${userProfile.zeni.toLocaleString()} Zeni` })
            .setTimestamp()
            .setFooter({ text: config.status });

        await interaction.reply({ embeds: [workEmbed] });
    },
};
