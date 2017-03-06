module.exports = {
	command: 'render',
	alias: 'r',
	desc: 'renders all static files',
	builder: {
		dir: {
			default: '.'
		}
	},
	handler: function (argv) {
		console.log(argv)

	}
}
