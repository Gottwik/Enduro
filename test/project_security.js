// vendor dependencies
var expect = require('chai').expect
var local_enduro = require('../index')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var trollhunter = require(enduro.enduro_path + '/libs/trollhunter')

describe('Enduro security', function () {

	// create a new project
	before(function (done) {
		local_enduro.run(['create', 'testproject_security'])
			.then(() => {
				// navigate inside new project
				enduro.project_path  = enduro.project_path + '/testproject_security'
				done()
			}, () => {
				done(new Error('Failed to create new project'))
			})
	})

	it('won\'t do nothing if no passphrase is provided', function (done) {
		local_enduro.run(['secure'])
			.then(() => {
				done(new Error('Failed to detect missing passphrase'))
			}, () => {
				done()
			})
	})

	it('should create a passphrase file when enduro is secured', function (done) {
		local_enduro.run(['secure', 'testphrase'])
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

	// navigate back to testfolder
	after(function () {
		enduro.project_path  = process.cwd() + '/testfolder'
	})
})
