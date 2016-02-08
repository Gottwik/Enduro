
// * ———————————————————————————————————————————————————————— * //
// * 	Kiska guard
// *	Provides simple security for securing the content
// *	Uses sessions to store logged in flag
// *	TODO: more robust ticket based security
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var fs = require('fs')
var passwordHash = require('password-hash');
var kiskaLogger = require('./kiska_logger')

var KiskaGuard = function () {}

var SECURE_FILE = '.enduro_secure'

KiskaGuard.prototype.login = function(req){
	return new Promise(function(resolve, reject){

		typeof req.session.lggin_flag !== 'undefined'
			? resolve()
			: verify(req, req.query['pswrd'], resolve, reject)

	})
}

KiskaGuard.prototype.setPassword = function(args){
	return new Promise(function(resolve, reject){

		// No password given
		if(!args.length){
			return kiskaLogger.err('\nProvide an passphrase \n\n\t$ enduro secure catthrewupagain\n')
		}

		// Stores the password
		var password = passwordHash.generate(args[0])

		fs.writeFile(SECURE_FILE, password, function(err) {
			if(err) { return kiskaLogger.err(err); }
			kiskaLogger.log('Enduro project is secure now') // TODO nice logging
			resolve();
		});
	})
}

function verify(req, password, resolve, reject){
	fs.readFile(SECURE_FILE, function read(err, data) {
		if(err) { return kiskaLogger.err(err); }

		if(passwordHash.verify(password, data.toString())){
			req.session.lggin_flag = true
			resolve()
		}
		else
		{
			reject()
		}
	});
}

module.exports = new KiskaGuard()