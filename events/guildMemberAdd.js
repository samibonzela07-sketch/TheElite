const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        console.log(`👤 ${member.user.tag} has entered the training grounds.`);

        // --- FEATURE 1: AUTO ROLE ---
        // Find a role named "Warrior" (or whatever you want your default role to be)
        const startingRole = member.guild.roles.cache.find(role => role.name === 'Warrior');
        if (startingRole) {
            await member.roles.add(startingRole).catch(err => console.error("Could not assign auto-role:", err));
        }

        // --- FEATURE 2: WELCOME EMBED ---
        // Find the system channel or a channel named "welcome"
        const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome') || member.guild.systemChannel;
        
        if (welcomeChannel) {
            const welcomeEmbed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`👋 Welcome to ${member.guild.name}!`)
                .setDescription(`Welcome ${member}, you have joined **${config.botName}** territory!\n\nTrain hard, gather your ${config.currency}, and increase your **${config.levelName}**!\n\nCurrent Server Population: **${member.guild.memberCount}** members.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: `${config.status}` });

            await welcomeChannel.send({ embeds: [welcomeEmbed] }).catch(err => console.error("Could not send welcome message:", err));
        }
    },
};
