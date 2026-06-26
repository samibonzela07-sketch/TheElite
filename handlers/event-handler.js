const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    // Look inside the 'events' folder (which we will create soon!)
    const eventsPath = path.join(__dirname, '../events');
    
    // Check if the events folder exists before reading it
    if (!fs.existsSync(eventsPath)) return;

    // Read all the file names inside the events folder
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        // If the event should only run once (like when the bot starts up)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            // Otherwise, let it run every single time the event happens
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`🐉 Loaded Event: ${event.name}`);
    }
};
