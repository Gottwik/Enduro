// load enduro for the first time to init global variables
require('../index')

// vendor dependencies
var rimraf = require('rimraf')

// local dependencies
var enduro_helpers = require('../libs/flat_utilities/enduro_helpers')

global.DELETE_TEST_PROJECTS = true

// create test folder where all the test projects will be created
before(function (done) {
	rimraf(process.cwd() + '/testfolder', function () {
		enduro_helpers.ensure_directory_existence(process.cwd() + '/testfolder/.')
			.then(() => {
				global.CMD_FOLDER = process.cwd() + '/testfolder'
				done()
			})
	})
})

// delete the test folder
after(function (done) {
	if (DELETE_TEST_PROJECTS) {
		rimraf(process.cwd() + '/testfolder', function () {
			done()
		})
	} else {
		done()
	}
})
