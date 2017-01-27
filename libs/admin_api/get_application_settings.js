// * ———————————————————————————————————————————————————————— * //
// * 	check juicebox enabledget_application_settings————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var juicebox = require(ENDURO_FOLDER + '/libs/juicebox/juicebox')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	var application_settings = __data.global.settings

	application_settings.juicebox_enabled = juicebox.juicebox_enabled()

	application_settings.has_admins = true

	flat_file_handler.load(ADMIN_SECURE_FILE)
		.then((raw_userlist) => {

			// if there are no users
			if (!raw_userlist.users) {
				application_settings.has_admins = false
			}

			res.send(application_settings)
		})

}

module.exports = new api_call()
