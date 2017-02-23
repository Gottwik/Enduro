// vendor dependencies
var expect = require('chai').expect
var path = require('path')

// local dependencies
var enduro = require(ENDURO_FOLDER + '/index')
var test_utilities = require(ENDURO_FOLDER + '/test/libs/test_utilities')

// only test if s3 is enabled

describe('cli upload', function () {
	this.timeout(5000)
	// Create a new project
	before(function (done) {
		var test_project_name = 'testfolder_upload'

		enduro.run(['create', test_project_name, 'test_juicebox'])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = path.join(CMD_FOLDER, test_project_name)
				done()
			}, () => {
				done(new Error('Failed to create new project'))
			})
	})

	it('reject if no filename is provided', function (done) {

		enduro.run(['upload'])
			.then(() => {
				done(new Error('should have rejected'))
			}, () => {
				done()
			})
	})

	it('should upload a file', function (done) {

		enduro.run(['upload', 'http://www.endurojs.com/assets/img/test/upload.test'])
			.then((destination_url) => {
				return test_utilities.request_file(destination_url)

			}, () => {
				done(new Error('uploading failed'))
			})
			.then((contents) => {
				expect(contents).to.equal('this is a enduro upload test file')
				done()
			})
	})

	it('should upload a file even if it has parameters in url', function (done) {

		enduro.run(['upload', 'http://www.endurojs.com/assets/img/test/upload.test?test=1'])
			.then((destination_url) => {
				return test_utilities.request_file(destination_url)
			}, () => {
				done(new Error('uploading failed'))
			})
			.then((contents) => {
				expect(contents).to.equal('this is a enduro upload test file')
				done()
			})
	})

	// navigate back to testfolder
	after(function () {
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})
})
