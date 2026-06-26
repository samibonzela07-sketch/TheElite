module.exports = {
    name: 'interactionCreate',
    once: false, // This needs to run every single time someone uses a command!
    async execute(interaction, client) {
        // If the interaction is not a slash command, ignore it
        if (!interaction.isChatInputCommand()) return;

        // Try to find the command code by its name
        const command = client.commands.get(interaction.commandName);

        // If the command doesn't exist, stop
        if (!command) return;

        try {
            // Run the command's code!
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            
            const errorMessage = { 
                content: '🐉 An error occurred while executing this command!', 
                ephemeral: true // Ephemeral means only the user who typed the command can see this error message
            };

            // If the bot already replied or deferred, follow up; otherwise, reply fresh
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};
