module.exports = {
	command: 'secure <passphrase>',
	desc: 'secures website against random visits',
	builder: (yargs) => {
		return yargs
			.usage('enduro secure <passphrase>')
			.example('enduro secure mypassword')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../index')

		enduro_instance.init()
			.then(() => {
				var trollhunter = require(enduro.enduro_path + '/libs/trollhunter')
				return trollhunter.set_passphrase(cli_arguments.passphrase)
			})
	}
}
