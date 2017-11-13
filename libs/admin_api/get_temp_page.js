// * ———————————————————————————————————————————————————————— * //
// * 	get temp page
// *
// * 	generates temporary html file and saves it in _generated/t folder
// *	@param {string} sid - session id stored in cookie on client
// *	@param {string} filename - name of the cms file. relative to cms/
// *	@param {string} content - content of the cms updated file - will be converted to js object and formated upon save
// *	@return {response} - success boolean and saved cms' file content
// * ———————————————————————————————————————————————————————— * //
const api_call = function () {}

// * vendor dependencies
const path = require('path')
const fs = require('fs')

// * enduro dependencies
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const admin_sessions = require(enduro.enduro_path + '/libs/admin_utilities/admin_sessions')
const logger = require(enduro.enduro_path + '/libs/logger')
const temper = require(enduro.enduro_path + '/libs/temper/temper')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	let jsonString = ''
	req.on('data', function (data) {
		jsonString += data
	})

	req.on('end', function () {

		jsonString = JSON.parse(jsonString)

		// gets parameters from query
		const sid = jsonString.sid
		const filename = jsonString.filename
		const content = jsonString.content

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
				const temp_filename = Math.random().toString(36).substring(7)
				const temp_destination_url = path.join('t', temp_filename)
				const temp_destination_path = path.join(enduro.project_path, enduro.config.build_folder, temp_destination_url + '/index.html')
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
