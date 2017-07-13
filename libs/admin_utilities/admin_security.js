// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Admin Security
// * ———————————————————————————————————————————————————————— * //
var admin_security = function () {}

// vendor dependencies
var Promise = require('bluebird')
var crypto = require('crypto')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')

// * ———————————————————————————————————————————————————————— * //
// * 	get user by username
// *	@param {string} username - username of user to be returned
// *	@return {object} - User as defiend in the user file
// * ———————————————————————————————————————————————————————— * //
admin_security.prototype.get_user_by_username = function (username) {
	return new Promise(function (resolve, reject) {
		// load up all admins
		return flat.load(enduro.config.admin_secure_file)
			.then((raw_userlist) => {

				// if there are no users
				if (!raw_userlist.users) {
					return reject('no users found')
				}

				// find user with specified username
				var selected_user = raw_userlist.users.filter((user) => {
					if (user.username == username) {
						return user
					}
				})

				// resolve/reject based on if user was found
				selected_user.length
					? resolve(selected_user[0])
					: reject('user not found')

			})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	get all users
// *	@return {list} - list of all user names
// * ———————————————————————————————————————————————————————— * //
admin_security.prototype.get_all_users = function () {

	// load up the user file
	return flat.load(enduro.config.admin_secure_file)
		.then((raw_userlist) => {

			// return empty array if no users found
			if (!raw_userlist.users) {
				return []
			}

			// return just usernames
			return raw_userlist.users.map(function (user) {
				return user.username
			})
		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	login by password
// *	@param {string} username
// *	@param {string} plaintext password
// *	@return {promise} - resolves if login successful and returns user
// * ———————————————————————————————————————————————————————— * //
admin_security.prototype.login_by_password = function (username, password) {
	var self = this

	return new Promise(function (resolve, reject) {

		// if username or password is missing
		if (!username || !password) {
			return reject({success: false, message: 'username or password not provided'})
		}

		// gets user with specified username
		self.get_user_by_username(username)
			.then((user) => {

				// hashes password
				var hashed_input_password = hash(password, user.salt)

				// compares hashed password with stored hash
				if (hashed_input_password == user.hash) {
					resolve(user)
				} else {

					// reject if provided password does not match the stored one
					reject({success: false, message: 'wrong password'})
				}
			}, () => {

				// reject if user does not exist
				reject({success: false, message: 'wrong username'})
			})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	add addmin
// *	@param {string} username
// *	@param {string} plaintext password
// *	@return {promise} - resolves/rejects based on if the creation was successful
// * ———————————————————————————————————————————————————————— * //
admin_security.prototype.add_admin = function (username, password, tags) {
	var self = this

	return new Promise(function (resolve, reject) {

		// sets username to 'root' if no username is provided
		if (!username || typeof username == 'object') {
			username = 'root'
		}

		// generate random password if no password is provided
		password = password || Math.random().toString(10).substring(10)

		// put empty tag if no tags are provided
		tags = tags
			? tags.split(',')
			: []

		var logincontext = {
			username: username,
			password: password,
			tags: tags
		}

		self.get_user_by_username(logincontext.username)
			.then(() => {
				logger.err_block('User \'' + username + '\' already exists')
				reject()
			}, () => {
				salt_and_hash(logincontext)
				timestamp(logincontext)

				return flat.upsert(enduro.config.admin_secure_file, {users: [logincontext]})
			})
			.then(() => {
				// Let the user know the project was created successfully
				logger.init('ENDURO - Creating admin user')
				logger.log('Username:', false)
				logger.tablog(username, true)
				logger.log('Password:', false)
				logger.tablog(password, true)
				logger.end()
				resolve()
			})
	})
}

admin_security.prototype.remove_all_users = function () {
	return flat.save('.users', {})
}

// private functions

// * ———————————————————————————————————————————————————————— * //
// * 	hash
// *	@param {string} plaintext password
// *	@param {string} salt
// *	@return {string} - hashed password
// * ———————————————————————————————————————————————————————— * //
function hash (password, salt) {
	return require('crypto').createHash('sha256').update(password + salt, 'utf8').digest('hex')
}

// * ———————————————————————————————————————————————————————— * //
// * 	salt and hash
// *	@param {object} logincontext
// *	@return {} - nothing, just adds salt and hash to logincontext
// * ———————————————————————————————————————————————————————— * //
function salt_and_hash (logincontext) {
	if (!logincontext || !logincontext.username || !logincontext.password) {
		return
	}

	// adds salt
	logincontext.salt = crypto.randomBytes(16).toString('hex')

	// adds hash
	logincontext.hash = hash(logincontext.password, logincontext.salt)

	// deletes plain password
	delete logincontext.password

}

// * ———————————————————————————————————————————————————————— * //
// * 	timestamp
// *	@param {object} logincontext
// *	@return {} - nothing, just adds timestamp to logincontext
// * ———————————————————————————————————————————————————————— * //
function timestamp (logincontext) {
	logincontext.user_created_timestamp = Date.now()

	return logincontext
}

module.exports = new admin_security()
