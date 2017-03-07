module.exports = {
	command: 'dev',
	aliases: ['*'],
	desc: 'starts development server',
	builder: {
		'norefresh': {
			alias: 'r',
			describe: 'no-refresh',
		},
		'nojuice': {
			alias: 'j',
			describe: 'no-juice',
		}
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../index')

		enduro_instance.init()
			.then(() => {
				enduro.flags = cli_arguments
				enduro.actions.developer_start()
			})
	}
}
