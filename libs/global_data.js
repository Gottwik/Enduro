var Promise = require('bluebird')
var fs = require('fs')

var kiskaLogger = require('./kiska_logger')
var k7_helpers = require('./k7_helpers')

var DATA_PATH = process.cwd() + '/cms/global.js'

var GlobalData = function () {}

GlobalData.prototype.getGlobalData = function(){
	return new Promise(function(resolve, reject){
		if(k7_helpers.fileExists(DATA_PATH)){
			global.__data = require(DATA_PATH)
			kiskaLogger.twolog('global data ', 'loaded')
			kiskaLogger.line();
		}
		else{
			kiskaLogger.err('no global file, use anif create to create scafolding')
		}
		resolve()
	})
}

module.exports = new GlobalData()