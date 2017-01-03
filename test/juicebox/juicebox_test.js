var expect = require('chai').expect

var enduro = require(ENDURO_FOLDER + '/index')
var juicebox = require(ENDURO_FOLDER + '/libs/juicebox/juicebox')

describe('Juicebox', function () {

	before(function (done) {

		var test_project_name = 'juicebox_testfolder'

		enduro.run(['create', test_project_name, 'test'])
			.then(() => {
				CMD_FOLDER = process.cwd() + '/testfolder/' + test_project_name

				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should pack project successfully', function () {
		return juicebox.pack()
			.then(() => {
				expect('a').to.equal('a')
			})
	})

	// navigate back to testfolder
	after(function () {
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})
})

