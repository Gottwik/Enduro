// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')

// local dependencies
var local_enduro = require('../../index').quick_init()
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')
var admin_security = require(enduro.enduro_path + '/libs/admin_utilities/admin_security')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

// rewired
var internal_admin_security = rewire(enduro.enduro_path + '/libs/admin_utilities/admin_security')

describe('Admin security', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'admin_security', 'minimalistic')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should return empty list when all users requested before any was created', function (done) {
		admin_security.get_all_users()
			.then((users) => {
				expect(users).to.be.empty
				done()
			})
	})

	it('should add root admin successfully', function (done) {
		admin_security.add_admin()
			.then(() => {
				return flat.load('.users')
			}, () => {
				done(new Error('failed to add admin'))
			})
			.then((users) => {
				expect(users.users[0]).to.have.property('username', 'root')
				expect(users.users[0]).to.have.property('salt')
				expect(users.users[0]).to.have.property('hash')
				expect(users.users[0]).to.have.property('user_created_timestamp')
				done()
			})
			.then(() => {}, () => {
				done(new Error('Failed to detect all the required properties for admin'))
			})
	})

	it('should add admin with custom name successfully', function (done) {
		admin_security.add_admin('gottwik', '123')
			.then(() => {
				return flat.load('.users')
			}, () => {
				done(new Error('failed to add admin'))
			})
			.then((users) => {
				expect(users.users[1]).to.have.property('username', 'gottwik')
				expect(users.users[1]).to.have.property('salt')
				expect(users.users[1]).to.have.property('hash')
				expect(users.users[1]).to.have.property('user_created_timestamp')
				done()
			})
			.then(() => {}, () => {
				done(new Error('Failed to detect all the required properties for admin'))
			})
	})

	it('should not be possible to add user with an already existing username', function (done) {
		admin_security.add_admin('gottwik', '123')
			.then(() => {
				done(new Error())
			}, () => {
				done()
			})
	})

	it('should find user by username', function (done) {
		admin_security.get_user_by_username('gottwik')
			.then((user) => {
				expect(user).to.have.property('username', 'gottwik')
				expect(user).to.have.property('salt')
				expect(user).to.have.property('hash')
				expect(user).to.have.property('user_created_timestamp')
				done()
			})
	})

	it('should not find user if username does not exist', function (done) {
		admin_security.get_user_by_username('ggottwik')
			.then((user) => {
				done(new Error('Failed to detect non-existent user'))
			}, () => {
				done()
			})
	})

	it('should get all users', function (done) {
		admin_security.get_all_users()
			.then((users) => {
				expect(users).to.be.instanceof(Array)
				expect(users).to.have.lengthOf(2)
				expect(users).include.members(['root', 'gottwik'])
				done()
			})
	})

	it('should be able to login by password', function (done) {
		admin_security.login_by_password('gottwik', '123')
			.then(() => {
				done()
			}, () => {
				done(new Error())
			})
	})

	it('should not be able to login without password', function (done) {
		admin_security.login_by_password('gottwik')
			.then(() => {
				done(new Error())
			}, () => {
				done()
			})
	})

	it('should be able to detect wrong password', function (done) {
		admin_security.login_by_password('gottwik', '1234')
			.then(() => {
				done(new Error())
			}, (response) => {
				expect(response.message).to.contain('wrong password')
				done()
			})
	})

	it('should be able to detect wrong username', function (done) {
		admin_security.login_by_password('gottwikgfd', '1234')
			.then(() => {
				done(new Error())
			}, (response) => {
				expect(response.message).to.contain('wrong username')
				done()
			})
	})

	it('should not be possible to hash and salt if either parameters are missing', function () {
		expect(internal_admin_security.__get__('salt_and_hash')()).to.be.empty
	})

	it('should be able to remove all users', () => {
		return admin_security.add_admin('dude', 'dude')
			.then(() => {
				return admin_security.remove_all_users()
			})
			.then(() => {
				return admin_security.get_all_users()
			})
			.then((users) => {
				expect(users).to.be.empty
			})
	})

	it('should be able to add users after deleting them all users', () => {
		return admin_security.remove_all_users()
			.then(() => {
				return admin_security.add_admin('dude', 'dude')
			})
			.then(() => {
				return admin_security.get_all_users()
			})
			.then((users) => {
				expect(users).to.include.members(['dude'])
			})
	})

	after(function () {
		return test_utilities.after()
	})
})
