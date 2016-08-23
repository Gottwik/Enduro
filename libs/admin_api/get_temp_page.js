// * ———————————————————————————————————————————————————————— * //
// * 	get temp page
// *
// * 	generates temporary html file and saves it in _src/t folder
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} filename - name of the cms file. relative to cms/
// *	@param {string} content - content of the cms updated file - will be converted to js object and formated upon save
// *	@return {response} - success boolean and saved cms' file content
// * ———————————————————————————————————————————————————————— * //
var api_call = function () {}

// Vendor dependencies
var path = require('path')
var fs = require('fs')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var admin_sessions = require(ENDURO_FOLDER + '/libs/admin_utilities/admin_sessions')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var temper = require(ENDURO_FOLDER + '/libs/temper/temper')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	var jsonString = ''
	req.on('data', function (data) {
		jsonString += data
	})

	req.on('end', function () {

		jsonString = JSON.parse(jsonString)

		// gets parameters from query
		var sid = jsonString.sid
		var filename = jsonString.filename
		var content = jsonString.content

		// makes sure all required query parameters were sent
		if (!sid || !filename || !content) {
			res.send({success: false, message: 'Parameters not provided'})
			return kiska_logger.err('parameters not provided')
		}

		admin_sessions.get_user_by_session(sid)
			.then((user) => {
				return temper.render(filename, content)
			}, () => {
				res.sendStatus(401)
				throw new Error('abort promise chain')
			})
			.then((temp_page_in_raw_html) => {
				var temp_filename = Math.random().toString(36).substring(7)
				var temp_destination_url = path.join('t', temp_filename)
				var temp_destination_path = path.join(CMD_FOLDER, '_src', temp_destination_url + '.html')
				enduro_helpers.ensure_directory_existence(temp_destination_path)
					.then(() => {
						fs.writeFile(temp_destination_path, temp_page_in_raw_html, function () {
							res.send(temp_destination_url)

						})
					})
			}, () => {})
	})

}

module.exports = new api_call()
