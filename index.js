const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Add this function to register commands
async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');
        // Make sure 'commands' is a collection of your command data
        const commands = []; 
        client.commands.forEach(cmd => commands.push(cmd.data.toJSON()));

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

client.once('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    await registerCommands(); // This runs the registration automatically!
});

client.login(process.env.TOKEN);
