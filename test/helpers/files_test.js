// vendor dependencies
var expect = require('chai').expect

global.__templating_engine = require('handlebars')

describe('Files helper', function () {

	require(ENDURO_FOLDER + '/hbs_helpers/compare')
	it('should list files successfully:', function () {
		expect(__templating_engine.compile('{{#files "/../test"}} {{this}} {{/files}}')().split(' ')).to.be.instanceof(Array)
	})

})
