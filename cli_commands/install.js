module.exports = {
	command: 'install <brick_name>',
	desc: 'installs new enduro.js brick[ehm, plugin]',
	builder: (yargs) => {
		return yargs
			.usage('enduro install <brick_name>')
			.example('enduro install enduro_quill')
	},
	handler: function (cli_arguments) {
		const enduro_instance = require('../index').init()
			.then(() => {
				return enduro.actions.install(cli_arguments.brick_name)
			})
	}
}
