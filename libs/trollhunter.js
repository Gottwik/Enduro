// * ———————————————————————————————————————————————————————— * //
// * 	trollhunter
// *
// *	provides simple security to protect the site against se crawling
// *	uses sessions to store logged in flag
// *	hashed passpphrase is stored in .enduro_secure file in local enduro app's root folder
// *
// *	note that this is not secure, and should be used as fast and simple
// * 	security during development
// * ———————————————————————————————————————————————————————— * //
var trollhunter = function () {}

// vendor rependencies
var Promise = require('bluebird')
var fs = require('fs')
var passwordHash = require('password-hash')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

// constants
var SECURE_FILE = '.enduro_secure'

// * ———————————————————————————————————————————————————————— * //
// * 	login endpoint
// *	@param {http request} req - request used to check if login flag is in the session
// *	@return {Promise} - Promise with no content. Resolve if login was successfull
// * ———————————————————————————————————————————————————————— * //
trollhunter.prototype.login = function (req) {
	var self = this
	return new Promise(function (resolve, reject) {

		typeof req.session.login_flag !== 'undefined'
			? resolve()
			: self.verify(req, req.query['pswrd'], resolve, reject)

	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	set passphrase
// *	@param {array} args - args[0] stores the desired passphrase
// *	@return {Promise} - Promise with no content. Resolve if password setup was successfull
// * ———————————————————————————————————————————————————————— * //
trollhunter.prototype.set_passphrase = function (plain_passphrase) {
	return new Promise(function (resolve, reject) {

		// No passphrase given
		if (!plain_passphrase) {
			reject('No passphrase provided')
			return logger.err('\nProvide an passphrase \n\n\t$ enduro secure catthrewupagain\n')
		}

		// Stores the passphrase
		var passphrase = passwordHash.generate(plain_passphrase)

		fs.writeFile(enduro.project_path + '/' + SECURE_FILE, passphrase, function (err) {
			if (err) {
				return logger.err(err)
			}

			logger.log('Enduro project is secure now')
			resolve()
		})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	verify passphrase
// *	@param {string} passphrase - passphrase to be checked against the stored one
// *	@return {Promise} - Promise with no content. Resolve if password verification was successfull
// * ———————————————————————————————————————————————————————— * //
trollhunter.prototype.verify_passphrase = function (passphrase) {
	return new Promise(function (resolve, reject) {

		if (!passphrase) {
			return reject('no passphrase provided')
		}
		// Reads the security file
		fs.readFile(enduro.project_path + '/' + SECURE_FILE, function read (err, data) {
			if (err) { return logger.err(err) }


			// Compares the hashed passphrase, sets session flag and resolves if successful
			if (passwordHash.verify(passphrase, data.toString())) {
				resolve()
			} else {
				reject('incorrect passphrase provided')
			}
		})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	main verification endpoint
// *	@param {http request} req - http request to check session
// *	@param {string} passphrase - http request to check session
// *	@param {function} resolve - success callback
// *	@param {function reject} req - failure callback
// *	@return {null} - calls resolve or reject callback based on if the login was successfull
// * ———————————————————————————————————————————————————————— * //
trollhunter.prototype.verify = function (req, passphrase, resolve, reject) {

	// don't check for security if no .enduro_secure file exists
	if (!(flat_helpers.file_exists_sync(enduro.project_path + '/' + SECURE_FILE))) {
		req.session.login_flag = true
		return resolve()
	}

	// reject if no passphrase is provided
	if (!passphrase) {
		return reject()
	}

	this.verify_passphrase(passphrase)
		.then(() => {
			req.session.login_flag = true
			resolve()
		}, () => {
			reject()
		})
}

module.exports = new trollhunter()
