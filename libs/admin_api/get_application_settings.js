// * ———————————————————————————————————————————————————————— * //
// * 	check juicebox enabledget_application_settings————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var juicebox = require(ENDURO_FOLDER + '/libs/juicebox/juicebox')

// routed call
api_call.prototype.call = function(req, res, enduro_server) {

	var application_settings = __data.global.settings

	application_settings.juicebox_enabled = juicebox.juicebox_enabled()

	res.send(application_settings)

}

module.exports = new api_call()