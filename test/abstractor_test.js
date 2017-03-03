var expect = require('chai').expect

var local_enduro = require('../index')
var abstractor = require(enduro.enduro_path + '/libs/abstractor/abstractor')
var path = require('path')

describe('Abstractor', function () {

	before(function (done) {

		var test_project_name = 'abstractor_testfolder'
		local_enduro.run(['create', test_project_name, 'test'])
			.then(() => {
				enduro.project_path = path.join(process.cwd(), 'testfolder', test_project_name)
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should register all the abstractors', function () {
		return abstractor.init()
			.then(() => {
				expect(enduro.precomputed_data.abstractors).to.include.keys('empty_init')
			})
	})

	// navigate back to testfolder
	after(function () {
		enduro.project_path = path.join(process.cwd(), '/testfolder')
	})
})

