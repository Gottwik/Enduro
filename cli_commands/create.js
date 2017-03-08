module.exports = {
	command: 'create <project_name> [scaffolding_name]',
	desc: 'creates new enduro.js project',
	builder: (yargs) => {
		return yargs
			.usage('enduro create <project_name>')
			.example('enduro create my_cool_project')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../index').init()
			.then(() => {
				return enduro.actions.create(cli_arguments.project_name, cli_arguments.scaffolding_name)
			})
	}
}
