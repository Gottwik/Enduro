module.exports = {
	command: 'theme <theme_name>',
	desc: 'uploads file to enduro.js file storage',
	builder: (yargs) => {
		return yargs
			.usage('enduro theme <theme_name>')
			.example('enduro theme mirror')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../index').init()
			.then(() => {
				return require(enduro.enduro_path + '/libs/theme_manager/theme_manager').create_from_theme(cli_arguments.theme_name)
			})
	}
}
