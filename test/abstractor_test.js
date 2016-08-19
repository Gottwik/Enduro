var expect = require('chai').expect

var enduro = require(ENDURO_FOLDER + '/index')
var abstractor = require(ENDURO_FOLDER + '/libs/abstractor/abstractor')

describe('Abstractor', function () {

	before(function (done) {

		var test_project_name = 'abstractor_testfolder'

		enduro.run(['create', test_project_name, 'test'])
			.then(() => {
				CMD_FOLDER = process.cwd() + '/testfolder/' + test_project_name
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should register all the abstractors', function () {
		return abstractor.init()
			.then(() => {
				expect(abstractors).to.include.keys('empty_init')
			})
	})

	// navigate back to testfolder
	after(function () {
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})
})

