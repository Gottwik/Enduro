// * ———————————————————————————————————————————————————————— * //
// * 	get stats
// *
// *	@return {response} - object with stats about the website
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Vendor dependencies

// local dependencies

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	var stats = {}

	stats.enduro_version = '1.0.40'

	res.send(stats)
}

module.exports = new api_call()
