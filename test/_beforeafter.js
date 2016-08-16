// vendor dependencies
var enduro = require('../index')
var rimraf = require('rimraf')
var fs = require('fs')

// local dependencies
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')

global.DELETE_TEST_PROJECTS = true;

//Create test folder where all the test projects will be created
before(function(done) {
	enduro_helpers.ensureDirectoryExistence(process.cwd() + '/testfolder/.')
		.then(() => {
			global.CMD_FOLDER = process.cwd() + '/testfolder'
			done()
		})
});

// delete the test folder
after(function(done) {
	if(DELETE_TEST_PROJECTS) {
		rimraf(process.cwd() + '/testfolder', function(err) {
			done()
		})
	}
	else {
		done()
	}
});