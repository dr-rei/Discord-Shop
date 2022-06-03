function commandHandler(client, config) {
    const fs = require('fs')
    const { REST } = require('@discordjs/rest')
    const { Routes } = require('discord-api-types/v9')
    const { Collection } = require('discord.js')
    const token = config.general.botToken;
    const guildId = config.general.serverGuildId;
    const clientId = config.general.botClientId;
    client.commands = new Collection()
    var commandFiles = fs.readdirSync("module/general").filter(file => file.endsWith('.js'))
    const postCommand = [];
    
    
    for (const file of commandFiles) {
        const command = require(`./general/${file}`);
        client.commands.set(command.data.name, command);
        postCommand.push(command.data.toJSON());
        
    }
    commandFiles = fs.readdirSync("module/pterodactyl").filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command = require(`./pterodactyl/${file}`);
        client.commands.set(command.data.name, command);
        postCommand.push(command.data.toJSON());
    }
    
    
    const rest = new REST({ version: '9' }).setToken(token);
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: postCommand })
        .then(() => console.log('Successfully registered application commands.')
        )
        .catch(console.error);

        
        

}

module.exports = { commandHandler }