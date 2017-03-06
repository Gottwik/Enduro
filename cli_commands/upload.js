var yargs = require('yargs')

module.exports = {
	command: 'upload <url_to_file>',
	desc: 'uploads file to enduro.js file storage',
	builder: () => {
		return yargs
			.usage('enduro create <url_to_file>')
			.example('enduro create www.example.com/bunny.jpg')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../index').init()
			.then(() => {
				require(enduro.enduro_path + '/libs/cli_tools/cli_upload').cli_upload(cli_arguments.url_to_file)
			})
	}
}
