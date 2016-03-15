var enduro = require('../index')
var rimraf = require('rimraf')
var fs = require('fs')
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')

//Create test folder where all the test projects will be created
before(function(done) {
	enduro_helpers.ensureDirectoryExistence(process.cwd() + '/testfolder/.')
		.then(() => {
			global.cmd_folder = process.cwd() + '/testfolder'
			done()
		})
});

// delete the test folder
after(function(done) {
	rimraf(process.cwd() + '/testfolder', function(err){
		done()
	})
});