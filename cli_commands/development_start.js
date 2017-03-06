module.exports = {
	command: 'dev',
	aliases: ['*'],
	desc: 'starts development server',
	handler: function () {
		var enduro_instance = require('../index')

		enduro_instance.init()
			.then(() => {
				enduro.actions.developer_start()
			})
	}
}
