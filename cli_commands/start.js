
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
		},
		'path': {
			describe: 'set the path to the enduro.js project',
			default: '',
		}
	},
	handler: function (cli_arguments) {
		const path = require('path')
		const enduro_instance = require('../index')

		const start_path = cli_arguments.path ? path.join(process.cwd(), cli_arguments.path) : ''

		enduro_instance.init(start_path)
			.then(() => {
				enduro.flags = cli_arguments
				enduro.actions.start()
			})
	}
}
