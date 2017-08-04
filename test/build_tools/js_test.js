// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var local_enduro = require('../../index').quick_init()
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Js transpiler build tool', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'js_testfolder', 'test_js')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should create js file for every js file in root assets/js folder', function () {
		expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, enduro.config.build_folder, 'assets', 'js', 'main.js'))).to.be.ok
	})

	it('should compile simple js file', function () {
		return test_utilities.request_file(path.join(enduro.config.build_folder, 'assets', 'js', 'main.js'))
			.then((file_contents) => {
				expect(file_contents).to.contain('\'use strict\';')
					.and.to.contain('# sourceMappingURL=data:application/json;charset=utf8')
			})
	})

	after(function () {
		return test_utilities.after()
	})
})

