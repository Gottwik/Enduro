// * ———————————————————————————————————————————————————————— * //
// * 	website api forwarder
// *	this module forwards the express application to enduro application
// *	to enable building of custom api and functionality
// * ———————————————————————————————————————————————————————— * //
var website_api = function () {}

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

// constants
var LOCAL_APP_FILE = CMD_FOLDER + '/app/app.js'

// * ———————————————————————————————————————————————————————— * //
// * 	forward app
// *
// *	@param {express application} app - root express app
// *	@return {null}
// * ———————————————————————————————————————————————————————— * //
website_api.prototype.forward = function (app) {

	// checks if app.js is present in local enduro app
	if (enduro_helpers.fileExists(LOCAL_APP_FILE)) {

		// forward the app to local enduro app
		require(LOCAL_APP_FILE).init(app)
	}
}

module.exports = new website_api()
