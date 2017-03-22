module.exports = {
	command: 'offline',
	desc: 'converts all external links into local links',
	handler: function (cli_arguments) {
		var enduro_instance = require('../index')

		enduro_instance.init()
			.then(() => {
				var offline_handler = require(enduro.enduro_path + '/libs/remote_tools/offline_handler')
				return offline_handler.convert_all_to_offline()
			})
	}
}
