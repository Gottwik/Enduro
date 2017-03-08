module.exports = {
	command: 'add <username> <password>',
	desc: 'adds one admin user',
	builder: (yargs) => {
		return yargs
			.usage('enduro admin add <username> <password>')
	},
	handler: function (cli_arguments) {
		var enduro_instance = require('../../index')

		enduro_instance.init()
			.then(() => {
				var admin_security = require(enduro.enduro_path + '/libs/admin_utilities/admin_security')
				return admin_security.add_admin(cli_arguments.username, cli_arguments.password)
			})
	}
}
