module.exports = {
	name: 'ready',
	once: true,
	async execute(client, config) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const cron = require('node-cron')


		//SET CRON EVERY SECONDS
		
		cron.schedule('* * * * * *', function() {
			
			client.emit('secondsEvent')
			
		})

		//SET CRON EVERY MINUTES
		cron.schedule('* * * * *', function() {
			client.emit('minutesEvent')
			
		})

		//SET CRON EVERY HOURS
		cron.schedule('0 * * * *', function() {
			client.emit('hoursEvent')
			
		})

		//SET CRON EVERY HOURS
		cron.schedule('0 * * * *', function() {
			client.emit('daysEvent')
			
		})

		
		


	},
};