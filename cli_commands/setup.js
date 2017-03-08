module.exports = {
	command: ['setup <command>', 's'],
	desc: 'handles versioning',
	builder: function (yargs) {
		return yargs
			.usage('enduro setup <command>')
			.commandDir('setup_commands')
	},
	handler: function () {}
}
