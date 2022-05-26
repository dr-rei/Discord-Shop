const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('event-test')
		.setDescription('Test Custom event in Console'),
	async execute(interaction) {
		interaction.client.emit('testEvent');
		await interaction.reply('Event Sent');
	},
};