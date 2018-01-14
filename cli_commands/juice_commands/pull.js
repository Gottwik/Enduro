module.exports = {
	command: 'pull',
	desc: 'downloads remote content and merges with local',
	builder: (yargs) => {
		return yargs
			.usage('enduro juice pull')
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
				const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')

				if (enduro.flags.force) {
					return juicebox.pull(true)
				} else {
					return juicebox.pull()
				}
			})
	}
}
