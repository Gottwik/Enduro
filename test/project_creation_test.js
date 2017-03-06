// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var local_enduro = require('../index').quick_init()
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var test_utilities = require('./libs/test_utilities')

describe('Enduro project creation', function () {

	before(() => {
		return test_utilities.delete_testfolder()
			.then(() => {
				return flat_helpers.ensure_directory_existence(path.join(enduro.project_path, 'testfolder', 'a'))
			})
			.then(() => {
				return local_enduro.init('testfolder')
			})
			.then(() => {
				enduro.actions.silent()
			})
	})

	it('should not create new project if no project name is provided', function (done) {
		enduro.actions.create()
			.then(() => {
				done(new Error('Failed to detect missing arguments'))
			}, () => {
				done()
			})
	})

	it('should be able to create a new project', function (done) {
		enduro.actions.create('testproject_creation')
			.then(() => {
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should fail if non-existent scaffolding is provided', function (done) {
		enduro.actions.create('testproject_creation', 'nonexistend_scaffolding')
			.then(() => {
				done(new Error(err))
			}, () => {
				done()
			})
	})

	it('should not create another project with the same name', function (done) {
		enduro.actions.create('testproject_creation')
			.then(() => {
				done(new Error('Failed to detect a project with the same name'))
			}, () => {
				done()
			})
	})

	it('the folder should exists', function () {
		expect(flat_helpers.dir_exists_sync(enduro.project_path + '/testproject_creation')).to.equal(true)
	})

	it('the project folder should have all the subfolders', function () {
		expect(flat_helpers.dir_exists_sync(enduro.project_path + '/testproject_creation/pages')).to.equal(true)
		expect(flat_helpers.dir_exists_sync(enduro.project_path + '/testproject_creation/app')).to.equal(true)
		expect(flat_helpers.dir_exists_sync(enduro.project_path + '/testproject_creation/assets')).to.equal(true)
		expect(flat_helpers.dir_exists_sync(enduro.project_path + '/testproject_creation/cms')).to.equal(true)
		expect(flat_helpers.dir_exists_sync(enduro.project_path + '/testproject_creation/components')).to.equal(true)
	})

	it('the project folder should contain files', function () {
		expect(flat_helpers.file_exists_sync(enduro.project_path + '/testproject_creation/package.json')).to.equal(true)
		expect(flat_helpers.file_exists_sync(enduro.project_path + '/testproject_creation/cms/index.js')).to.equal(true)
	})

	it('should be able to create a new project with defined scaffolding', function (done) {
		enduro.actions.create('custom_scaffolding', 'test')

			.then(() => {
				expect(flat_helpers.file_exists_sync(path.join(enduro.project_path, 'custom_scaffolding', 'app', 'markdown_rules', 'test_markdown_rule.js'))).to.equal(true)
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	after(function () {
		return test_utilities.after()
	})
})
