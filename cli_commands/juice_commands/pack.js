module.exports = {
	command: 'pack',
	desc: 'uploads local content to remote',
	builder: (yargs) => {
		return yargs
			.usage('enduro juice pack')
			.options({
				'force': {
					alias: 'f',
					describe: 'will not pull before pack, overriding whatever is in juicebar',
				},
			})
	},
	handler: function (cli_arguments) {
		const enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {
				enduro.flags = cli_arguments

				const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
				if (enduro.flags.force) {
					return juicebox.force_pack()
				} else {
					return juicebox.pack()
				}
			})
	}
}
