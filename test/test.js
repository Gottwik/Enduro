var expect = require("chai").expect
var enduro = require('../index')
var rimraf = require('rimraf')
var fs = require('fs')

// Remove logging
enduro.silent()

describe('Enduro', function() {
	describe('General cli interface', function () {

		it('should do nothing if malformed arguments are provided', function () {
			var enduro_run = enduro.run(['someweirdargument'])
			expect(enduro_run).equals(false)
		});
	});

	describe('Creating new project', function () {
		var enduro_run = false;

		beforeEach(function(done){
			enduro_run = enduro.run(['create', 'testproject'])
			setTimeout(function(){
				done();
			}, 1800);
		});

		it("Project folder should be created", function(){
			expect(enduro_run).equals(true);
		});


		beforeEach(function(done){
			rimraf(process.cwd() + '/testproject', function(err){
				done()
			})
		});

	});
});