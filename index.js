// --- RENDER COMPATIBILITY PORT BINDING ---
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('The Bot is running smoothly!\n');
});
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`📡 Render port binding active on port ${PORT}`);
});
// ──────────────────────────────────────────

// --- AUTOMATIC COMMAND REGISTRATION ---
try { require('./deploy-commands.js'); } catch (e) { console.error('Command deployment failed:', e); }
// ──────────────────────────────────────

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Dynamically load handlers
const handlersPath = path.join(__dirname, 'handlers');
if (fs.existsSync(handlersPath)) {
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
    for (const file of handlerFiles) {
        require(`./handlers/${file}`)(client);
    }
}

client.login(process.env.TOKEN);
