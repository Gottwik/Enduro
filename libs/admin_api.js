// * ———————————————————————————————————————————————————————— * //
// * 	Admin api handler
// *	All admin_api/* endpoints are routed here, and are consequently
// *	routed into the admin_api folder
// * ———————————————————————————————————————————————————————— * //
var admin_api = function () {}

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// Gets api name from url - /admin_api/get_something will call get_something.js
admin_api.prototype.call = function (req, res, enduro_server) {

	// Extracts api call name
	var api_name = req.url.match(/\/admin_api\/([^?]*)?.*/)[1]
	kiska_logger.timestamp('making api call: ' + api_name, 'admin_api_calls')

	// Executes call function from specified api name
	require('./admin_api/' + api_name).call(req, res, enduro_server)
}

module.exports = new admin_api()
