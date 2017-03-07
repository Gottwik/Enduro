// vendor dependencies
var Promise = require('bluebird')
var expect = require('chai').expect
var path = require('path')
var fs = Promise.promisifyAll(require('fs-extra'))

// local dependencies
var local_enduro = require('../../index').quick_init()
var enduro_configurator = require(enduro.enduro_path + '/libs/configuration/enduro_configurator')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('Enduro configuration adding', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'add_config_testfolder')
	})

	it('read the default config', function () {
		var public_config = require(path.join(enduro.project_path, 'enduro.json'))
		expect(public_config).to.have.property('project_name')
		expect(public_config['project_name']).to.equal('enduro test')
	})

	it('be able to add test variable', function () {
		return enduro_configurator.set_config({ test_property: 'test_value' })
			.then(() => {
				return fs.readJsonAsync(path.join(enduro.project_path, 'enduro.json'))
			})
			.then((public_config) => {
				expect(public_config).to.have.property('test_property')
				expect(public_config['test_property']).to.equal('test_value')
			})
	})

	it('be able to add secret test variable', function () {
		return enduro_configurator.set_config({ secret: { test_property: 'test_value' } })
			.then(() => {
				return Promise.all([
					fs.readJsonAsync(path.join(enduro.project_path, 'enduro.json')),
					fs.readJsonAsync(path.join(enduro.project_path, 'enduro_secret.json'))
				])
			})
			.spread((public_config, secret_config) => {
				expect(public_config).to.not.have.property('secret')
				expect(secret_config.secret).to.have.property('test_property')
				expect(secret_config.secret['test_property']).to.equal('test_value')
			})
	})

	it('be able to add both public and secret test variable', function () {
		return enduro_configurator.set_config({ test_property_2: 'test_value2', secret: { secret_test_property2: 'secret_value2' } })
			.then(() => {
				return Promise.all([
					fs.readJsonAsync(path.join(enduro.project_path, 'enduro.json')),
					fs.readJsonAsync(path.join(enduro.project_path, 'enduro_secret.json'))
				])
			})
			.spread((public_config, secret_config) => {
				expect(public_config).to.have.property('test_property_2')
				expect(public_config['test_property_2']).to.equal('test_value2')
				expect(secret_config.secret).to.have.property('secret_test_property2')
				expect(secret_config.secret['secret_test_property2']).to.equal('secret_value2')
			})
	})

	after(function () {
		return test_utilities.after()
	})
})

