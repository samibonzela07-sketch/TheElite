const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member, client) {
        console.log(`❌ ${member.user.tag} has left the server.`);

        // Find a channel named "goodbye", "welcome", or use the default server channel
        const goodbyeChannel = member.guild.channels.cache.find(ch => ch.name === 'goodbye') || 
                             member.guild.channels.cache.find(ch => ch.name === 'welcome') || 
                             member.guild.systemChannel;
        
        if (goodbyeChannel) {
            const goodbyeEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle(`😢 A Warrior Has Left`)
                .setDescription(`**${member.user.tag}** has left the training grounds.\n\nWe are down to **${member.guild.memberCount}** survivors.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: `${config.status}` });

            await goodbyeChannel.send({ embeds: [goodbyeEmbed] }).catch(err => console.error("Could not send goodbye message:", err));
        }
    },
};
