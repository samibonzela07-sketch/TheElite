const { REST, Routes } = require('discord.js');

// These are the secret keys the bot needs to talk to Discord
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// For now, our command list is empty. We will fill this up later!
const commands = [];

// Prepare the tool that will send the commands to Discord
const rest = new REST({ version: '10' }).setToken(token);

// This function pushes the commands to your specific server (Guild)
(async () => {
    try {
        console.log('🐉 Started refreshing application (/) commands.');

        // This line sends the data directly to Discord's setup system
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('🐉 Successfully reloaded application (/) commands.');
    } catch (error) {
        // If anything goes wrong, it will print the error here
        console.error(error);
    }
})();
