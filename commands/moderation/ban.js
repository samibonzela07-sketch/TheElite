const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a problematic user from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for banning this user')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Restricts this menu option to staff
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided by the Supreme Kai.';
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // --- SECURITY VALIDATION CHECKS ---
        if (!member) {
            return interaction.reply({ content: '❌ That user is not in this server.', ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ 
                content: '❌ My power level isn\'t high enough! I cannot ban this user. (They might have a higher role than me).', 
                ephemeral: true 
            });
        }

        // Execute the ban actions
        await member.ban({ reason: reason }).catch(err => {
            console.error(err);
            return interaction.reply({ content: '❌ Failed to ban the user due to an internal error.', ephemeral: true });
        });

        // Build a striking punishment confirmation card
        const banEmbed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle(`🔨 The Hakai Hammer Has Fallen`)
            .setDescription(`**${targetUser.tag}** has been permanently exiled from the server territory.`)
            .addFields(
                { name: 'Target Warrior', value: `${targetUser}`, inline: true },
                { name: 'Enforced By', value: `${interaction.user}`, inline: true },
                { name: 'Reason Given', value: `\`\`\`${reason}\`\`\``, inline: false }
            )
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: config.status });

        await interaction.reply({ embeds: [banEmbed] });
    },
};
