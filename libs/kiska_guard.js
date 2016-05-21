// * ———————————————————————————————————————————————————————— * //
// * 	Kiska guard
// *	Provides simple security for securing the content
// *	Uses sessions to store logged in flag
// *	TODO: switch to bcrypt
// *	TODO: switch login to async
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var fs = require('fs')
var passwordHash = require('password-hash')
var kiska_logger = require('./kiska_logger')
var enduro_helpers = require('./flat_utilities/enduro_helpers')

var KiskaGuard = function () {}

var SECURE_FILE =  '.enduro_secure'

KiskaGuard.prototype.login = function(req){
	var self = this;
	return new Promise(function(resolve, reject){

		typeof req.session.lggin_flag !== 'undefined'
			? resolve()
			: self.verify(req, req.query['pswrd'], resolve, reject)

	})
}

KiskaGuard.prototype.set_passphrase = function(args){
	return new Promise(function(resolve, reject){

		// No passphrase given
		if(!args.length){
			reject('No passphrase provided')
			return kiska_logger.err('\nProvide an passphrase \n\n\t$ enduro secure catthrewupagain\n')
		}

		// Stores the passphrase
		var passphrase = passwordHash.generate(args[0])

		fs.writeFile(CMD_FOLDER + '/' + SECURE_FILE, passphrase, function(err) {
			if(err) { return kiska_logger.err(err); }
			kiska_logger.log('Enduro project is secure now') // TODO nice logging
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
		fs.readFile(CMD_FOLDER + '/' + SECURE_FILE, function read(err, data) {
			if(err) { return kiska_logger.err(err); }

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

KiskaGuard.prototype.verify = function(req, passphrase, resolve, reject){

	// don't check for security if no .enduro_secure file exists
	if(!(enduro_helpers.fileExists(CMD_FOLDER + '/' + SECURE_FILE))){
		req.session.lggin_flag = true
		resolve()
		return
	}

	// reject if no passphrase is provided
	if(!passphrase){
		reject()
		return
	}

	this.verify_passphrase(passphrase)
		.then(() => {
			req.session.lggin_flag = true
			resolve()
		}, () => {
			reject()
		})
}

module.exports = new KiskaGuard()