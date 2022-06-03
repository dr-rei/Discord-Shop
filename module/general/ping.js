const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
		
	async execute(interaction, config) {

		const permissions = require('../permission.js')
		const denied = require('../../function/permissionDenied.js')
		const allowed = await permissions.slashRolePermission(config.permission.general, interaction)
		if(!allowed){
			denied.permissionDenied(interaction)
		}else{
			
			const respone = new MessageEmbed()
				.setColor("#0000ff")
				.setDescription("***CALCULATING PING....***");

		
			const reply = await interaction.reply({ embeds: [respone], fetchReply: true })
			const PingAPI = interaction.client.ws.ping
			const PingBOT = reply.createdTimestamp - interaction.createdTimestamp 
	
			
			const result = new MessageEmbed()
				.setColor("#0000ff")
				.setDescription("**PING RESULT**")
				.addFields(
					{ name: 'API Ping :', value: "```"+PingAPI+" ms```", inline: true },
					{ name: 'Bot Ping :', value: "```"+PingBOT+" ms```", inline: true },
				)
			await interaction.editReply({embeds: [result]})

		}
		
		
	},
};