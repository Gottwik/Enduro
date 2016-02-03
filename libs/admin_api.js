var AdminApi = function () {}

AdminApi.prototype.call = function(req, res){
	var api_url = req.url.match(/\/admin_api\/([^?]*)?.*/)[1];
	var api_call = require('./admin_api/'+api_url).call(req, res, req.query);
}

module.exports = new AdminApi()