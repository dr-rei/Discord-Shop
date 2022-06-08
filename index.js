const fs = require('fs')
const { Client, Intents } = require('discord.js')
const configuration = require("./function/configRead.js")
const config = configuration.configRead();
const token = config.general.botToken;
const slashHandler = require("./module/handler")
const { REST } = require('@discordjs/rest')
const rest = new REST({ version: '9' }).setToken(token);
const { Routes } = require('discord-api-types/v9')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS] })
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const event = require(`./events/${file}`)
	if (event.once) {

		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}


slashHandler.commandHandler(client, config)


client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, config);

	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});





client.login(token);
