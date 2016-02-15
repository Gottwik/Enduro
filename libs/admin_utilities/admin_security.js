
// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Admin Security
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var fs = require('fs')
var passwordHash = require('password-hash')
var kiskaLogger = require('../kiska_logger')
var enduro_helpers = require('../enduro_helpers')

var AdminSecurity = function () {}

var ADMIN_SECURE_FILE = 'cms/.users.js'

AdminSecurity.prototype.addUser = function(username){
	return new Promise(function(resolve, reject){

		if(!enduro_helpers.fileExists(ADMIN_SECURE_FILE)){
			fs.writeFile(ADMIN_SECURE_FILE, 'module.exports = {}', function(err) {
				if(err) { return kiskaLogger.err(err); }
				kiskaLogger.log('Enduro project is secure now') // TODO nice logging
				resolve();
			});
		}
	})
}


module.exports = new AdminSecurity()