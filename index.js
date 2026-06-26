
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Create a new bot client (the connection to Discord)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// A collection is like a smart folder to hold all our future commands
client.commands = new Collection();

// When the bot is ready and logged in, print a message in the console
client.once('ready', () => {
    console.log(`🐉 The Elite is online! Protecting Dragon Soul.`);
    
    // Set the custom status you requested
    if (client.user) {
        client.user.setActivity('Protecting Dragon Soul', { type: 4 }); // Type 4 is "Custom Status"
    }
});

// Log the bot into Discord using the secret TOKEN saved on Render
client.login(process.env.TOKEN);
