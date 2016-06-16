// vendor dependencies
var expect = require("chai").expect

global.__templating_engine = require('handlebars')

describe('Compare helper', function() {

	require(ENDURO_FOLDER + "/hbs_helpers/compare")

	// {{compare 1 1 "yes" "no"}}
	it('should compare two numbers successfully', function () {
		expect(__templating_engine.compile('{{compare 1 1 "yes" "no"}}')()).to.equal('yes')
	})

	it('should detect different values', function () {
		expect(__templating_engine.compile('{{compare 1 2 "yes" "no"}}')()).to.equal('no')
	})

})