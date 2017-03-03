// * ———————————————————————————————————————————————————————— * //
// * 	get structured global dataset list
// *
// * 	admin api endpoint admin_api/get_datasetlist
// *	@return {response} - success boolean and flattened dataset list in an array
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// local dependencies
var pagelist_generator = require(enduro.enduro_path + '/libs/build_tools/pagelist_generator')
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	admin_sessions.get_user_by_session(req.query.sid)
		.then((user) => {
			return pagelist_generator.get_cms_list()
		}, (user) => {
			throw new Error('abort promise chain')
		})
		.then((pagelist) => {
			res.send({success: true, data: pagelist})
		}, () => {
			res.send({success: false, message: 'failed to get the cms list'})
		})
}

module.exports = new api_call()
