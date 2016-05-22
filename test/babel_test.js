var expect = require('chai').expect

var babel = require(global.ENDURO_FOLDER + '/libs/babel/babel')
var enduro = require(ENDURO_FOLDER + '/index')
var rewire = require('rewire')

var internal_babel = rewire(global.ENDURO_FOLDER + '/libs/babel/babel')

describe('Babel - registering cultures', function() {

	before(function(done) {
		enduro.run(['create', 'babel_test'])
			.then(() => {
				CMD_FOLDER = process.cwd() + '/testfolder/babel_test'
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
				done(new Error("Failed to load cultures"))
			})
	})

	it('should add cultures correctly', function (done) {
		babel.add_culture(['en', 'de'])
			.then(() => {
				return babel.get_cultures()
			}, () => {
				done(new Error("Failed to load cultures"))
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
		enduro.run(['addculture', 'fr', 'es'])
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
	after(function(){
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})
})


describe('Babel - culturalizing cms files', function() {

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

	var test_nested_context = {
		greeting: 'you',
		$greeting_de: 'du!',
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