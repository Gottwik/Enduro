module.exports = {
	command: 'start',
	desc: 'starts production server',
	handler: function () {
		var enduro_instance = require('../index')

		enduro_instance.init()
			.then(() => {
				enduro.actions.start()
			})
	}
}
