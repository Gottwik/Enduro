module.exports = {
	command: ['render', 'r'],
	desc: 'renders all static files',
	builder: {
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
				enduro.actions.render()
			})
	}
}
