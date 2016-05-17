// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Admin Security
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird')
var fs = require('fs')
var sha256 = require('sha256')

var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')

var AdminSecurity = function () {}

var ADMIN_SECURE_FILE = '.users'

AdminSecurity.prototype.add_admin = function(username, password){
	return new Promise(function(resolve, reject){

		// sets username to 'root' if no username is provided
		if(!username || typeof username == 'object') {
			username = 'root'
		}

		//generate random password if no password is provided
		password = password || Math.random().toString(10).substring(10);

		var logincontext = {
			username: username,
			password: password
		}

		return flat_file_handler.add(ADMIN_SECURE_FILE, logincontext, 'users')
			.then(() => {

				// Let the user know the project was created successfully
				kiska_logger.init('ENDURO - Creating admin user')
				kiska_logger.log('Username:', true)
				kiska_logger.log('     ' + username, true)
				kiska_logger.log('Password:', true)
				kiska_logger.log('     ' + password, true)

				kiska_logger.log('Don\'t forget to change password!', true)
				kiska_logger.end()
				resolve()

			})

	})
}


module.exports = new AdminSecurity()