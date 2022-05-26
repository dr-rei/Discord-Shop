const { SlashCommandBuilder } = require('@discordjs/builders');
const Nodeactyl = require('nodeactyl');
const embedResponse = require('../function/response_nodeList')
const configuration = require("../function/configRead.js")
const config = configuration.configRead();

const application = new Nodeactyl.NodeactylApplication(config.ptero.panelUrl, config.ptero.appAPIKey);
module.exports = {
	data: new SlashCommandBuilder()
		.setName('node-list')
		.setDescription('Show all nodes'),
	async execute(interaction) {
        const response =  await application.getAllNodes()
		const channelId = interaction.channel.id
		const channel = interaction.client.channels.cache.get(channelId);
		const page = response.data.length/5
		const embed = await embedResponse.embedResponse(response.data, page)
		for(i=0;i<page;i++){
			channel.send({ embeds: [embed[i]] });
		}
		

        await interaction.reply('Command Running!')
		
	},
};