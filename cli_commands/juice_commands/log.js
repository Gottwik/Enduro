module.exports = {
	command: ['log', 'l'],
	desc: 'shows edit history',
	builder: (yargs) => {
		return yargs
			.alias('l')
			.usage('enduro juice log')
	},
	handler: function (cli_arguments) {
		const enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {

				const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
				return juicebox.log()
			})
	}
}
