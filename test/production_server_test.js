var expect = require('chai').expect
var local_enduro = require('../index').quick_init()
var request = require('request')
var test_utilities = require('./libs/test_utilities')

describe('Production server', function () {
	this.timeout(7000)
	before(function () {
		return test_utilities.before(local_enduro, 'testproject_productionserver', 'minimalistic')
			.then(() => {
				return enduro.actions.start()
			})
	})

	it('should server something on port 5000', function (done) {
		request('http://localhost:5000/', function (error, response, body) {
			if (error) { console.log(error) }
			expect(body).to.contain('body')
			expect(body).to.contain('head')
			expect(body).to.contain('title')
			done()
		})
	})

	it('should serve admin interface', function (done) {
		request('http://localhost:5000/admin', function (error, response, body) {
			if (error) { console.log(error) }
			expect(body).to.contain('body')
			expect(body).to.contain('head')
			expect(body).to.contain('ng-view ng-cloak')
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
