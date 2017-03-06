var expect = require('chai').expect
var request = require('request')

var local_enduro = require('../../index').quick_init()
var test_utilities = require('../libs/test_utilities')

describe('admin api', function () {

	var sid

	before(function () {
		return test_utilities.before(local_enduro, 'admin_api')
			.then(() => {
				return enduro.actions.start()
			})
	})

	it('should not get token if no session is provided', function (done) {
		request('http://localhost:5000/admin_api/check_session', function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.success).to.be.not.ok
			done()
		})
	})

	it('should be able to login with password', function (done) {
		request.get({
			url: 'http://localhost:5000/admin_api/login_by_password',
			qs: {username: 'gottwik', password: '123'}
		}, function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.success).to.be.ok
			expect(res).to.have.all.keys('success', 'username', 'sid', 'created', 'expires_at')
			sid = res.sid
			done()
		})
	})

	it('should be able to get cms list', function (done) {
		request.get({
			url: 'http://localhost:5000/admin_api/get_cms_list',
			qs: {sid: sid}
		}, function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.data).to.contain.all.keys('structured', 'flat')
			done()
		})
	})

	it('should be able to get admin_extension list', function (done) {
		request.get({
			url: 'http://localhost:5000/admin_api/get_admin_extensions',
			qs: {sid: sid}
		}, function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.success).to.be.ok
			expect(res.data).to.not.be.empty
			expect(res.data[0]).to.have.string('sample_extension')
			done()
		})
	})

	after(function () {
		return enduro.actions.stop_server()
			.then(() => {
				return test_utilities.after()
			})
	})

})
