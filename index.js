const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');

// Create a new bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Smart folder to hold our commands
client.commands = new Collection();

// --- CONNECT OUR HANDLERS ---
// This tells the brain to look at the handler files and turn them on
require('./handlers/command-handler')(client);
require('./handlers/event-handler')(client);

// When the bot is ready, print a message
client.once('ready', () => {
    console.log(`🐉 The Elite is online! Protecting Dragon Soul.`);
    
    if (client.user) {
        client.user.setActivity('Protecting Dragon Soul', { type: 4 });
    }
});

// Log into Discord
client.login(process.env.TOKEN);
