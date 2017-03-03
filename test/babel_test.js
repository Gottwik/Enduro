
// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')
var path = require('path')

// local dependencies
var local_enduro = require('../index')
var babel = require(global.enduro.enduro_path + '/libs/babel/babel')

// rewired dependencies
var internal_babel = rewire(global.enduro.enduro_path + '/libs/babel/babel')

describe('Babel - registering cultures', function () {

	before(function (done) {
		local_enduro.run(['create', 'babel_test'])
			.then(() => {
				enduro.project_path = path.join(process.cwd(), 'testfolder', 'babel_test')
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should read the empty cultures correctly', function (done) {
		babel.get_cultures()
			.then((cultures) => {
				expect(cultures).to.exist
				expect(cultures).to.be.a('array')
				expect(cultures).not.to.be.empty
				expect(cultures[0]).to.equal('')
				done()
			}, () => {
				done(new Error('Failed to load cultures'))
			})
	})

	it('should add cultures correctly', function (done) {
		babel.add_culture(['en', 'de'])
			.then(() => {
				return babel.get_cultures()
			}, () => {
				done(new Error('Failed to load cultures'))
			})
			.then((cultures) => {
				expect(cultures).to.exist
				expect(cultures).to.be.a('array')
				expect(cultures).not.to.be.empty
				expect(cultures).to.include('en')
				expect(cultures).to.include('de')
				done()
			})
	})

	it('should add cultures correctly by cli', function (done) {
		local_enduro.run(['addculture', 'fr', 'es'])
			.then(() => {
				return babel.get_cultures()
			})
			.then((cultures) => {
				expect(cultures).to.exist
				expect(cultures).to.be.a('array')
				expect(cultures).not.to.be.empty
				expect(cultures).to.include('en')
				expect(cultures).to.include('de')
				expect(cultures).to.include('fr')
				expect(cultures).to.include('es')
				done()
			})
	})

	// navigate back to testfolder
	after(function () {
		enduro.project_path = process.cwd() + '/testfolder'
	})
})

describe('Babel - culturalizing cms files', function () {

	var test_context = {
		greeting: 'you',
		$greeting_de: 'du!',
		superlative: 'asd'
	}

	var expected_terminated_context = {
		greeting: 'you',
		superlative: 'asd'
	}

	var expected_culturalized_context_de = {
		greeting: 'du!',
		superlative: 'asd'
	}

	it('should terminate context correctly', function (done) {
		expect(JSON.stringify(internal_babel.__get__('terminate')(test_context))).to.equal(JSON.stringify(expected_terminated_context))
		done()
	})

	it('should culturalize object currectly', function (done) {
		expect(JSON.stringify(babel.culturalize(test_context, 'de'))).to.equal(JSON.stringify(expected_culturalized_context_de))
		done()
	})

	it('should culturalize object currectly with non-present cultural key', function (done) {
		expect(JSON.stringify(babel.culturalize(test_context, 'en'))).to.equal(JSON.stringify(expected_terminated_context))
		done()
	})

})
