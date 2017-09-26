
// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')
var path = require('path')
var request = require('request-promise')
var glob = require('glob')

// local dependencies
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
var local_enduro = require('../../index').quick_init()
var babel = require(enduro.enduro_path + '/libs/babel/babel')
var theme_manager = require(enduro.enduro_path + '/libs/theme_manager/theme_manager')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

describe('[online_test] Theme manager server endpoints', function () {

	before(function () {
		this.timeout(5000)
		return local_enduro.init()
			.then(() => {
				enduro.actions.silent()
			})
	})

	it('should fetch list of all themes', function () {
		return theme_manager.get_all_themes()
			.then((theme_list) => {
				expect(theme_list).to.be.an('array')
			})
	})

	it('should fetch info for the \'mirror\' theme', function () {
		return theme_manager.fetch_theme_info_by_name('mirror', { stealth: true })
			.then((theme_info) => {
				expect(theme_info).to.be.an('object')
				expect(theme_info.name).to.equal('mirror')
			})
	})

	it('should download and extract a theme package', function () {
		this.timeout(5000)
		var extract_to_directory = 'theme_extract_test'
		global.enduro.project_path = path.join(process.cwd(), 'testfolder')

		return theme_manager.download_and_extract_theme_by_gz_link('https://github.com/Gottwik/enduro_mirror/archive/master.tar.gz', extract_to_directory)
			.then(() => {
				var files = glob.sync(path.join(enduro.project_path, '*'))

				expect(files).to.have.length.above(5)
			})
	})

	after(function () {
		return test_utilities.after()
	})

})
