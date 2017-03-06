// vendor dependencies
var expect = require('chai').expect

// local dependencies
var local_enduro = require('../index').quick_init()
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var trollhunter = require(enduro.enduro_path + '/libs/trollhunter')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Enduro security', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'testproject_security')
	})

	it('won\'t do nothing if no passphrase is provided', function (done) {
		trollhunter.set_passphrase()
			.then(() => {
				done(new Error('Failed to detect missing passphrase'))
			}, () => {
				done()
			})
	})

	it('should create a passphrase file when enduro is secured', function (done) {
		trollhunter.set_passphrase('testphrase')
			.then(() => {
				done()
			}, () => {
				done(new Error('Failed to detect missing passphrase'))
			})
	})

	it('should make sure the passphrase file is created', function () {
		expect(flat_helpers.file_exists_sync(enduro.project_path + '/.enduro_secure')).to.equal(true)
	})

	it('should verify the correct passphrase', function (done) {
		trollhunter.verify_passphrase('testphrase')
			.then(() => {
				done()
			}, () => {
				done(new Error('Failed to verify the correct passphrase'))
			})
	})

	it('should fail to verify the incorrect passphrase', function (done) {
		trollhunter.verify_passphrase('notcorrectpassphrase')
			.then(() => {
				done(new Error('Failed to not verify the incorrect passphrase'))
			}, () => {
				done()
			})
	})

	it('should fail to verify the empty passphrase', function (done) {
		trollhunter.verify_passphrase()
			.then(() => {
				done(new Error('Failed to not verify the incorrect passphrase'))
			}, () => {
				done()
			})
	})

	after(function () {
		return test_utilities.after()
	})
})
