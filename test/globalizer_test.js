
// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')
var path = require('path')
var request = require('request-promise')

// local dependencies
var local_enduro = require('../index')
var globalizer = require(global.enduro.enduro_path + '/libs/globalizer/globalizer')
var test_utilities = require('./libs/test_utilities')

describe('Globalizer - globalization', function () {

	it('should link adjacent value', function () {
		var test_context = {
			car: 'toyota',
			also_car: '@@car'
		}
		globalizer.globalize(test_context, test_context)

		expect(test_context.also_car).to.equal('toyota')
	})

	it('should link adjacent object', function () {
		var test_context = {
			car: {
				name: 'toyota',
				price: 10
			},
			also_car: '@@car'
		}
		globalizer.globalize(test_context, test_context)

		expect(test_context.also_car.name).to.equal('toyota')
		expect(test_context.also_car.price).to.equal(10)
	})

	it('should link adjacent array', function () {
		var test_context = {
			cars: [
				{
					name: 'car1'
				},
				{
					name: 'car2'
				},
				{
					name: 'car3'
				},
			],
			also_cars: '@@cars'
		}
		globalizer.globalize(test_context, test_context)

		expect(test_context.also_cars)
			.to.be.a('array')
			.to.have.length.of(3)
	})

	it('should provide empty string when globalizer is not found', function () {
		var test_context = {
			car: 'toyota',
			whoops: '@@bicycle'
		}
		globalizer.globalize(test_context, test_context)

		expect(test_context.whoops).to.equal('')
	})

	it('should provide empty string when globalizer has non-existing key', function () {
		var test_context = {
			car: {
				name: 'toyota'
			},
			whoops: '@@car.car_color.rgb'
		}
		globalizer.globalize(test_context, test_context)

		expect(test_context.whoops).to.equal('')
	})

	after(function () {
		return test_utilities.after()
	})
})

describe('Globalizer - api endpoints', function () {

	var sid

	this.timeout(7000)
	before(function () {
		return test_utilities.before(local_enduro, 'globalizer_api_test')
			.then(() => {
				return enduro.actions.start()
			})
			.then(() => {
				return test_utilities.get_sid()
			})
			.then((fetched_sid) => {
				sid = fetched_sid
			})
	})

	it('should provide globalizer options on calling admin_api/get_globalizer_options', function () {
		return request({
				url: 'http://localhost:5000/admin_api/get_globalizer_options',
				qs: {
					sid: sid,
					globalizer_string: '@@global.fake_nesting.toys.mindstorms',
				}
			})
			.then((globalizer_options) => {
				globalizer_options = JSON.parse(globalizer_options)
				expect(globalizer_options)
					.to.be.an('array')
					.to.have.lengthOf(2)
					.to.include('@@global.fake_nesting.toys.mindstorms')
					.to.include('@@global.fake_nesting.toys.duplo')
			})
	})

	it('should provide globalizer options by local globalizer string', function () {
		return request({
				url: 'http://localhost:5000/admin_api/get_globalizer_options',
				qs: {
					sid: sid,
					globalizer_string: '@@local_fake_options.car',
					page_path: '/index',
				}
			})
			.then((globalizer_options) => {
				globalizer_options = JSON.parse(globalizer_options)
				expect(globalizer_options)
					.to.be.an('array')
					.to.have.lengthOf(2)
					.to.include('@@local_fake_options.car')
					.to.include('@@local_fake_options.tram')
			})
	})

	it('should provide globalized context by local globalizer string', function () {
		return request({
				url: 'http://localhost:5000/admin_api/get_globalized_context',
				qs: {
					sid: sid,
					globalizer_string: '@@local_fake_options.car',
					page_path: '/index',
				}
			})
			.then((globalizer_options) => {
				globalizer_options = JSON.parse(globalizer_options)

				expect(globalizer_options).to.be.an('object')
				expect(globalizer_options.price).to.equal(10)
			})
	})

	after(function () {
		return enduro.actions.stop_server()
			.then(() => {
				return test_utilities.after()
			})
	})

})
