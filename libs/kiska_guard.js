// * ———————————————————————————————————————————————————————— * //
// * 	Kiska guard
// *	Provides simple security for securing the content
// *	Uses sessions to store logged in flag
// *	TODO: switch to bcrypt
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var fs = require('fs')
var passwordHash = require('password-hash')
var kiskaLogger = require('./kiska_logger')
var enduro_helpers = require('./flat_utilities/enduro_helpers')

var KiskaGuard = function () {}

var SECURE_FILE =  '.enduro_secure'

KiskaGuard.prototype.login = function(req){
	return new Promise(function(resolve, reject){

		typeof req.session.lggin_flag !== 'undefined'
			? resolve()
			: verify(req, req.query['pswrd'], resolve, reject)

	})
}

KiskaGuard.prototype.set_passphrase = function(args){
	return new Promise(function(resolve, reject){

		// No passphrase given
		if(!args.length){
			reject('No passphrase provided')
			return kiskaLogger.err('\nProvide an passphrase \n\n\t$ enduro secure catthrewupagain\n')
		}

		// Stores the passphrase
		var passphrase = passwordHash.generate(args[0])

		fs.writeFile(cmd_folder + '/' + SECURE_FILE, passphrase, function(err) {
			if(err) { return kiskaLogger.err(err); }
			kiskaLogger.log('Enduro project is secure now') // TODO nice logging
			resolve();
		});
	})
}

KiskaGuard.prototype.verify_passphrase = function(passphrase){
	return new Promise(function(resolve, reject){

		if(!passphrase){
			reject('no passphrase provided')
		}

		// Reads the security file
		fs.readFile(cmd_folder + '/' + SECURE_FILE, function read(err, data) {
			if(err) { return kiskaLogger.err(err); }

			// Compares the hashed passphrase, sets session flag and resolves if successful
			if(passwordHash.verify(passphrase, data.toString())){
				resolve()
			}
			else
			{
				reject('incorrect passphrase provided')
			}
		});
	})
}

function verify(req, passphrase, resolve, reject){

	// If no .enduro_secure file exists, don't check for security
	if(!enduro_helpers.fileExists(cmd_folder + '/' + SECURE_FILE)){
		req.session.lggin_flag = true
		resolve()
		return
	}

	verifyPassphrase(passphrase)
		.then(() => {
			req.session.lggin_flag = true
			resolve()
		}, () => {
			reject()
		})
}

module.exports = new KiskaGuard()