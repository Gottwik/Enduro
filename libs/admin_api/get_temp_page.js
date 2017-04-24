// * ———————————————————————————————————————————————————————— * //
// * 	get temp page
// *
// * 	generates temporary html file and saves it in _generated/t folder
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
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
var logger = require(enduro.enduro_path + '/libs/logger')
var temper = require(enduro.enduro_path + '/libs/temper/temper')

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
			return logger.err('parameters not provided')
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
				var temp_destination_path = path.join(enduro.project_path, enduro.config.build_folder, temp_destination_url + '.html')
				flat_helpers.ensure_directory_existence(temp_destination_path)
					.then(() => {
						fs.writeFile(temp_destination_path, temp_page_in_raw_html, function () {
							res.send(temp_destination_url)
						})
					})
			}, () => {})
	})

}

module.exports = new api_call()
