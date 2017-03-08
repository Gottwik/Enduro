module.exports = {
	command: 'add <cultures..>',
	desc: 'adds one or more culture',
	builder: (yargs) => {
		return yargs
			.usage('enduro culture add <cultures..>')
			.example('enduro culture add en de fr es')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {
				var babel = require(enduro.enduro_path + '/libs/babel/babel')
				return babel.add_culture(cli_arguments.cultures)
			})
	}
}
