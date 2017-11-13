// * ———————————————————————————————————————————————————————— * //
// * 	get stats
// *
// *	@return {response} - object with stats about the website
// * ———————————————————————————————————————————————————————— * //
const api_call = function () {}

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	let stats = {}

	stats.enduro_version = '1.0.40'

	res.send(stats)
}

module.exports = new api_call()
