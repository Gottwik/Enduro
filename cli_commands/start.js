module.exports = {
	command: 'start',
	desc: 'starts production server',
	builder: {
		'nojuice': {
			alias: 'j',
			describe: 'no-juice',
		},
		'port': {
			alias: 'p',
			describe: 'sets the production port',
			default: 5000,
		}
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../index')

		enduro_instance.init()
			.then(() => {
				enduro.flags = cli_arguments
				enduro.actions.start()
			})
	}
}
