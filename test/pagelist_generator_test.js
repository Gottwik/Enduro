var expect = require('chai').expect
var gulp = require('gulp')

var local_enduro = require('../index')
var pagelist_generator = require(enduro.enduro_path + '/libs/build_tools/pagelist_generator')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

describe('Page list generation', function () {

	before(function (done) {
		local_enduro.run(['create', 'pagelist_generator_test', 'test'])
			.then(() => {
				enduro.project_path = process.cwd() + '/testfolder/pagelist_generator_test'
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should generate cmslist', function (done) {
		pagelist_generator.generate_cms_list()
			.then((cmslist) => {
				expect(cmslist).to.have.property('flat')
				expect(cmslist).to.have.property('structured')
				expect(cmslist).to.have.deep.property('structured.testgenerator.folder', true)
				expect(cmslist['flat']).to.have.length.of.at.least(3)
				done()
			})
	})

	it('should register gulp task', function () {
		var gulp_task_name = pagelist_generator.init(gulp)
		expect(gulp.tasks[gulp_task_name]).to.not.be.undefined
	})

	it('should save the cmslist', function () {
		pagelist_generator.generate_cms_list()
			.then((cmslist) => {
				return pagelist_generator.save_cms_list(cmslist)
			})
			.then(() => {
				expect(flat_helpers.file_exists_sync(pagelist_generator.get_pregenerated_pagelist_path())).to.be.ok
			})
	})

	// navigate back to testfolder
	after(function () {
		enduro.project_path = process.cwd() + '/testfolder'
	})

})
