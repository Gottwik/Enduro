var AdminApi = function () {}

	// Gets api name from url - /admin_api/get_something will call get_something.js
AdminApi.prototype.call = function(req, res, enduro_server){

	// Extracts api call name
	var api_name = req.url.match(/\/admin_api\/([^?]*)?.*/)[1];

	// Executes call function from specified api name
	var api_call = require('./admin_api/' + api_name).call(req, res, enduro_server);
}

module.exports = new AdminApi()