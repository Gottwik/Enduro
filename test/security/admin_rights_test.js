// vendor dependencies
var expect = require('chai').expect

// local dependencies
var local_enduro = require('../../index')
var admin_rights = require(enduro.enduro_path + '/libs/admin_utilities/admin_rights')

describe('Admin rights', function () {

	it('user without tags should be able to write, read, temp and delete', function () {
		expect(admin_rights.can_user_do_that({name: 'superuser'}, 'write')).to.be.true
		expect(admin_rights.can_user_do_that({name: 'superuser'}, 'read')).to.be.true
		expect(admin_rights.can_user_do_that({name: 'superuser'}, 'temp')).to.be.true
		expect(admin_rights.can_user_do_that({name: 'superuser'}, 'delete')).to.be.true
	})

	it('demo user should not be able to write and delete, but should be able to read and temp', function () {
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['demo']}, 'write')).to.be.false
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['demo']}, 'read')).to.be.true
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['demo']}, 'temp')).to.be.true
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['demo']}, 'delete')).to.be.false
	})

	it('made up tag should not be able to do anything', function () {
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['asdagwge']}, 'write')).to.be.false
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['asdagwge']}, 'read')).to.be.false
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['asdagwge']}, 'temp')).to.be.false
		expect(admin_rights.can_user_do_that({name: 'demo', tags: ['asdagwge']}, 'delete')).to.be.false
	})

})
