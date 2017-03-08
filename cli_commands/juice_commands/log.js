module.exports = {
	command: ['log', 'l'],
	desc: 'shows edit history',
	builder: (yargs) => {
		return yargs
			.alias('l')
			.usage('enduro juice log')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {

				var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
				return juicebox.log()
			})
	}
}
