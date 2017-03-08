module.exports = {
	command: 'upload <url>',
	desc: 'uploads file to enduro.js file storage',
	builder: (yargs) => {
		return yargs
			.usage('enduro create <url>')
			.example('enduro create www.example.com/bunny.jpg')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../index').init()
			.then(() => {
				enduro.actions.upload(cli_arguments.url)
			})
	}
}
