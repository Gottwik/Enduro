module.exports = {
	command: 'theme [theme_name]',
	desc: 'uploads file to enduro.js file storage',
	builder: (yargs) => {
		return yargs
			.usage('enduro theme <theme_name>')
			.example('enduro theme mirror')
	},
	handler: function (cli_arguments) {
		require('../index').quick_init()
		return require(enduro.enduro_path + '/libs/theme_manager/theme_manager').create_from_theme(cli_arguments.theme_name)
	}
}
