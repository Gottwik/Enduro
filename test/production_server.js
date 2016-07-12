var expect = require("chai").expect
var enduro = require('../index')
var request = require('request');

describe('Production server', function() {

	//Create a new project
	before(function(done){
		enduro.run(['create', 'testproject_productionserver'])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = CMD_FOLDER + '/testproject_productionserver'
				enduro.run(['start'], [])
					.then(() => {
						done()
					})
			}, () => {
				done(new Error("Failed to create new project"))
			})
	});

	it("should server something on port 5000", function(done){
		request('http://localhost:5000/', function(error, response, body) {
			expect(body).to.contain('body');
			expect(body).to.contain('head');
			expect(body).to.contain('title');
			done()
		});
	})

	it("should serve admin interface", function(done){
		request('http://localhost:5000/admin', function(error, response, body) {
			expect(body).to.contain('body');
			expect(body).to.contain('head');
			expect(body).to.contain('ng-view ng-cloak');
			done()
		});
	})

	// navigate back to testfolder
	after(function(done){
		enduro.server_stop(() => {
			global.CMD_FOLDER = process.cwd() + '/testfolder'
			done()
		})
	})

})