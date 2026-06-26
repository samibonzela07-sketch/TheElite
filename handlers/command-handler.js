const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    // Look inside the 'commands' folder (which we will create soon!)
    const commandsPath = path.join(__dirname, '../commands');
    
    // Check if the commands folder exists before reading it
    if (!fs.existsSync(commandsPath)) return;

    // Read all the sub-folders inside the commands folder (like moderation, economy)
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        
        // Find all files that end with '.js'
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            // If the command has a data name and an execute function, load it up!
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                console.log(`🐉 Loaded Command: /${command.data.name}`);
            } else {
                console.log(`⚠️ The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
};
