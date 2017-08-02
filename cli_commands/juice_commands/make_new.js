// why would anybody need this? This is useful if you edit the cms files by hand
// if you just save them and push them to juicebox they might be evaluated as older
// then for example just pulled files
module.exports = {
	command: ['make_new', 'm'],
	desc: 'timestamps all cms files with current time',
	builder: (yargs) => {
		return yargs
			.alias('m')
			.usage('enduro juice make_new')
	},
	handler: function (cli_arguments) {
		const enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {

				const juice_make_new = require(enduro.enduro_path + '/libs/juicebox/juice_make_new')
				return juice_make_new.make_new()
			})
	}
}
