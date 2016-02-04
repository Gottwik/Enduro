
// * ———————————————————————————————————————————————————————— * //
// * 	Scaffolder
// *	Handles new project creation
// *	Gets whats after enduro create as @args
// * ———————————————————————————————————————————————————————— * //

var Promise = require('bluebird');
var ncp = require('ncp').ncp;
var kiskaLogger = require('./kiska_logger')

var Scaffolder = function () {}

Scaffolder.prototype.scaffold = function(args){
	return new Promise(function(resolve, reject){

		// No project name given
		if(!args.length){
			reject()
			return kiskaLogger.err('\nProvide project name as \n\n\t$ enduro create projectname\n')
		}

		// Stores project name
		var projectName = args[0]
		// Source of the scaffolding - Directory where enduro is installed
		var source = __dirname + '/../scaffolding'

		// Destination directory
		var destination = process.cwd() + '/' + projectName

		kiskaLogger.init('ENDURO - CREATING PROJECT')
		kiskaLogger.log('Creating new project ' + projectName)
		kiskaLogger.line()

		// Copy files - Without overwriting existing files
		ncp(source, destination, {clobber: false}, function (err) {
			if (err) {
				// Something went wrong with the copying
				reject()
				return kiskaLogger.errBlock(err);
			}
			kiskaLogger.log('Project created successfully.')
			kiskaLogger.line()
			kiskaLogger.log('Dont forget to cd into project with', true)
			kiskaLogger.log('     $ cd ' + projectName, true)
			kiskaLogger.log('Then run', true)
			kiskaLogger.log('     $ enduro', true)
			kiskaLogger.end()
			resolve()
		});
	})
}

module.exports = new Scaffolder()