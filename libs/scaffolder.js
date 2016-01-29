var Promise = require('bluebird');
var fs = require('fs')
var async = require("async")
var glob = require("glob")
var ncp = require('ncp').ncp;

var kiskaLogger = require('./kiska_logger')

var Scaffolder = function () {}

Scaffolder.prototype.scaffold = function(){
	return new Promise(function(resolve, reject){
		var source = __dirname + '/../scaffolding'
			var destination = process.cwd()

			ncp(source, destination, function (err) {
				if (err) {
					return console.error(err);
				}
				resolve()
			});
	})
}

module.exports = new Scaffolder()