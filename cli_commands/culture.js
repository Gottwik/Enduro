module.exports = {
	command: 'culture <command>',
	desc: 'handles cultures',
	builder: function (yargs) {
		return yargs
		.commandDir('culture_commands')
	},
	handler: function () {}
}
