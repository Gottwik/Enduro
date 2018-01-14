module.exports = {
	command: 'diff [version_hash] [file]',
	desc: 'displays diff with remotely stored file',
	builder: (yargs) => {
		return yargs
			.usage('enduro juice diff [version_hash] [file]')
			.example('enduro juice diff')
			.example('enduro juice diff afd9012rr1fA2')
			.example('enduro juice diff afd9012rr1fA2 global/mainmenu.js')
	},
	handler: function (cli_arguments) {
		const enduro_instance = require('../../index').quick_init()
		const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
		const juice_diff = require(enduro.enduro_path + '/libs/juicebox/juice_diff')

		enduro_instance.init()
			.then(() => {
				return juicebox.diff(cli_arguments.version_hash, cli_arguments.file)
			})
			.then((diff) => {
				if (diff) {
					juice_diff.print_out_diff(diff)
				}
			})
	}
}
