var expect = require("chai").expect
var enduro = require('../index')
var request = require('request');

describe('Should server something', function() {

	//Create a new project
	before(function(done){
		enduro.run(['create', 'testproject_server'])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = CMD_FOLDER + '/testproject_server'
				done()
			}, () => {
				done(new Error("Failed to create new project"))
			})
	});

	it("starts development server", function(done){
		enduro.run([], ['nr'])
			.then(() => {
				request('http://localhost:3000/', function(error, response, body) {
					expect(body).to.contain('body');
					expect(body).to.contain('head');
					expect(body).to.contain('title');
					done()
				});
			}, () => {
				done(new Error("Failed to start development server"))
			})
	})

	// navigate back to testfolder
	after(function(){
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})

})