// * ———————————————————————————————————————————————————————— * //
// * 	trollhunter
// *
// * 	admin api endpoint admin_api/trollhunter
// *	@return {response} - success boolean
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Local dependencies
var trollhunter = require(ENDURO_FOLDER + '/libs/trollhunter')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {
	trollhunter.login(req)
		.then(() => {
			res.send({ success: true })
		}, () => {
			res.send({ success: false })
		})
}

module.exports = new api_call()
