// global dependencies
const inquirer = require('inquirer')

module.exports = {
	command: 'create [project_name] [scaffolding_name]',
	desc: 'creates new enduro.js project',
	builder: (yargs) => {
		return yargs
			.usage('enduro create <project_name>')
			.example('enduro create my_cool_project')
	},
	handler: function (cli_arguments) {

		let project_name = cli_arguments.project_name
		// if no project name is given
		let all_arguments_given = Promise.resolve();
		if (!project_name) {
			all_arguments_given = inquirer.prompt([
				{
					name: 'project_name',
					message: 'Project name',
					type: 'input',
				},
			])
			.then((answers) => {
				project_name = answers.project_name
			})
		}

		all_arguments_given.then(() => {
			return require('../index').init()
		})
		.then(() => {
			return enduro.actions.create(project_name, cli_arguments.scaffolding_name)
		})
	}
}
