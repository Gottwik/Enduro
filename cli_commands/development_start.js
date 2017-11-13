module.exports = {
	command: ['dev', 'd'],
	desc: 'starts development server',
	builder: {
		'norefresh': {
			alias: 'r',
			describe: 'won\'t open browser on enduro start-up',
		},
		'nojuice': {
			alias: 'j',
			describe: 'turns juicebox off',
		},
		'nowatch': {
			alias: 'w',
			describe: 'will not watch for file changes',
		},
		'noremotewatch': {
			describe: 'will not watch /remote directory',
		},
		'nocontentwatch': {
			alias: 'c',
			describe: 'will not watch for changes of content/cms files',
		},
		'noproduction': {
			alias: 'p',
			describe: 'will not start the production flavor',
		},
	},
	handler: function (cli_arguments) {
		const enduro_instance = require('../index')

		enduro_instance.init({ flags: cli_arguments })
			.then(() => {
				enduro.actions.developer_start()
			})
	}
}
