module.exports = {
	command: ['juice <command>', 'j'],
	desc: 'handles versioning',
	builder: function (yargs) {
		return yargs
			.usage('enduro juice <command>')
			.commandDir('juice_commands')
	},
	handler: function () {}
}
