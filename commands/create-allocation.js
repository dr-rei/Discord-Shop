const { SlashCommandBuilder } = require('@discordjs/builders');
const Nodeactyl = require('nodeactyl');
const randInt = require('../function/randomInteger')



module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-allocation')
		.setDescription('Create Allocation')
        .addIntegerOption(option => option.setName('nodes-id').setDescription('Input the nodes ID').setRequired(true))
		.addIntegerOption(option => option.setName('total').setDescription('Input Total Allocation That Will Generated').setRequired(true))
		.addIntegerOption(option => option.setName('min-range').setDescription('Minimun range for allocation port').setRequired(true))
		.addIntegerOption(option => option.setName('max-range').setDescription('Maximum range for allocation port').setRequired(true)),
	async execute(interaction, config) {
		const application = new Nodeactyl.NodeactylApplication(config.ptero.panelUrl, config.ptero.appAPIKey);
        const nodeId = interaction.options.getInteger('nodes-id')
		const allocationLimit = interaction.options.getInteger('total')
		const minRange = interaction.options.getInteger('min-range')
		const maxRange = interaction.options.getInteger('max-range')
        const response =  await application.getNodeAllocations(nodeId)
		const channelId = interaction.channel.id
		const channel = interaction.client.channels.cache.get(channelId)
		var portAllocation = []
		var arrayAllocation = response.data
		for(var i=0;i<allocationLimit;){
			const randNumber = randInt.getRndInteger(minRange, maxRange)
			console.log(randNumber)
			let allocationCheck = await arrayAllocation.find(registeredAllocation => registeredAllocation.attributes.port === randNumber);
			let allocation2Check = await portAllocation.find(registeredAllocation => registeredAllocation === randNumber);
			if(allocationCheck || allocation2Check){
				console.log('there is duplicate port from randomizer that port is '+randNumber)
			}else{
				console.log('registering port to array(port:'+randNumber+")")
				portAllocation.push(randNumber.toString())
				i++
			}

		}

		console.log('list of port will registered')
		await interaction.reply('Command Running!')
		console.log(portAllocation)
		const registerAllocation = await application.createNodeAllocations(nodeId, '0.0.0.0', portAllocation)
		if(registerAllocation == false){
			console.log(registerAllocation)
			await interaction.editReply('ERROR - Something Wrong')
		}
		else{
			await interaction.editReply('Complete!')
			await channel.send(`REGISTERED PORT: ${portAllocation}`)
		}
		
		
		

		

		

        
		
	},
};