// * ———————————————————————————————————————————————————————— * //
// * 	check juicebox enabled
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var juicebox = require(ENDURO_FOLDER + '/libs/juicebox/juicebox')

// routed call
api_call.prototype.call = function(req, res, enduro_server){

	res.send(juicebox.juicebox_enabled())

}

module.exports = new api_call()