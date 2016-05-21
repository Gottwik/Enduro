// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Admin Security
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird')
var crypto = require("crypto");

var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')

var admin_security = function () {}

var ADMIN_SECURE_FILE = '.users'

admin_security.prototype.get_user_by_username = function(username) {
	return new Promise(function(resolve, reject){
		return flat_file_handler.load(ADMIN_SECURE_FILE)
			.then((raw_userlist) => {

				if(!raw_userlist.users) {
					return reject('no users found')
				}

				var selected_user = raw_userlist.users.filter((user) => {
					if(user.username == username) {
						return user
					}
				})

				selected_user.length
					? resolve(selected_user[0])
					: reject('user not found')

			})
	})
}

admin_security.prototype.get_all_users = function(username) {
	return flat_file_handler.load(ADMIN_SECURE_FILE)
		.then((raw_userlist) => {

			if(!raw_userlist.users) {
				return []
			}

			return raw_userlist.users.map(function(user) {
				return user.username
			})
		})
}

admin_security.prototype.admin_exists = function(username) {
	var self = this

	return new Promise(function(resolve, reject){
		self.get_all_users()
			.then((userlist) => {
				userlist.indexOf(username) == -1
					? resolve()
					: reject()
			})
	})
}

admin_security.prototype.login_by_password = function(username, password) {
	var self = this
	return new Promise(function(resolve, reject){
		if(!username || !password) {
			reject({success: false, message: 'username or password not provided'})
		}

		var logincontext = {
			username: username,
			password: password
		}

		self.get_user_by_username(logincontext.username)
			.then((user) => {
				var hashed_input_password = hash(password, user.salt)

				if(hashed_input_password == user.hash) {
					resolve(user)
				} else {
					reject({success: false, message: 'wrong username'})
				}
			}, () => {})
	})
}

admin_security.prototype.add_admin = function(username, password) {
	var self = this

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

		self.admin_exists(logincontext.username)
			.then(() => {

				logincontext = salt_and_hash(logincontext)
				logincontext = timestamp(logincontext)

				flat_file_handler.add(ADMIN_SECURE_FILE, logincontext, 'users')
					.then(() => {

						// Let the user know the project was created successfully
						kiska_logger.init('ENDURO - Creating admin user')
						kiska_logger.log('Username:', false)
						kiska_logger.tablog(username, true)
						kiska_logger.log('Password:', false)
						kiska_logger.tablog(password, true)
						kiska_logger.line()
						kiska_logger.log('Don\'t forget to change password!', false)
						kiska_logger.end()
						resolve()

					})
			}, () => {
				kiska_logger.errBlock('User \'' + username + '\' already exists')
			})
	})
}

// Private

function hash(password, salt) {
	return require('crypto').createHash('sha256').update(password + salt, "utf8").digest("hex");
}

function salt_and_hash(logincontext) {
	if(!logincontext.username || !logincontext.password) {
		return logincontext
	}

	// adds salt
	logincontext.salt = crypto.randomBytes(16).toString('hex');

	// adds hash
	logincontext.hash = hash(logincontext.password, logincontext.salt)


	// deletes plain password
	delete logincontext.password

	return logincontext
}

function timestamp(logincontext) {
	logincontext.user_created_timestamp = Date.now()

	return logincontext
}


module.exports = new admin_security()