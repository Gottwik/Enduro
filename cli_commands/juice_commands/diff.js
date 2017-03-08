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
		var enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {

				var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
				return juicebox.diff(cli_arguments.version_hash, cli_arguments.file)
			})
	}
}
