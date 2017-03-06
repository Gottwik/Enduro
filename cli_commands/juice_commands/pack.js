var yargs = require('yargs')

module.exports = {
	command: 'pack',
	desc: 'uploads local content to remote',
	builder: () => {
		return yargs
			.usage('enduro juice pack')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {
				enduro.flags = cli_arguments

				var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
				if (enduro.flags.force) {
					return juicebox.force_pack()
				} else {
					return juicebox.pack()
				}
			})
	}
}
