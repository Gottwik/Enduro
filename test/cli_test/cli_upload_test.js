// vendor dependencies
var expect = require('chai').expect

// local dependencies
var local_enduro = require('../../index').quick_init()
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('[online_test] cli upload', function () {
	this.timeout(5000)

	before(function () {
		return test_utilities.before(local_enduro, 'devserver', 'test_juicebox')
	})

	it('reject if no filename is provided', function (done) {
		enduro.actions.upload()
			.then(() => {
				done(new Error('should have rejected'))
			}, () => {
				done()
			})
	})

	it('should upload a file', function (done) {
		enduro.actions.upload('http://www.endurojs.com/assets/img/test/upload.test')
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
		enduro.actions.upload('http://www.endurojs.com/assets/img/test/upload.test?test=1')
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

	after(function () {
		return test_utilities.after()
	})
})

describe('cli upload with local filesystem', function () {
	this.timeout(5000)

	before(function () {
		return test_utilities.before(local_enduro, 'devserver')
	})

	it('reject if no filename is provided', function (done) {
		enduro.actions.upload()
			.then(() => {
				done(new Error('should have rejected'))
			}, () => {
				done()
			})
	})

	it('should upload a file', function (done) {
		enduro.actions.upload('http://www.endurojs.com/assets/img/test/upload.test')
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
		enduro.actions.upload('http://www.endurojs.com/assets/img/test/upload.test?test=1')
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

	after(function () {
		return test_utilities.after()
	})
})
