module.exports = {
	command: 'admin <command>',
	desc: 'handles admin users',
	builder: function (yargs) {
		return yargs
			.usage('enduro admin <command>')
			.commandDir('admin_commands')
	},
	handler: function () {}
}
