// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Admin Security
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird')
var fs = require('fs')
var sha256 = require('sha256')

var kiskaLogger = require(ENDURO_FOLDER+'/libs/kiska_logger')
var flat_file_handler = require(ENDURO_FOLDER+'/libs/flat_utilities/flat_file_handler')

var AdminSecurity = function () {}

var ADMIN_SECURE_FILE = '.users'

AdminSecurity.prototype.addUser = function(username, password){
	return new Promise(function(resolve, reject){

		flat_file_handler.create_if_doesnt_exist(ADMIN_SECURE_FILE, {})

	})
}


module.exports = new AdminSecurity()