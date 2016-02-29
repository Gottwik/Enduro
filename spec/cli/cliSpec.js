var enduro = require('../../index')

describe("Cli tools", function() {

	it("Do nothing if wrong cli argument is provided", function() {
		var enduro_run = enduro.run(['somethingrandom...']);
		expect(enduro_run).toEqual(false);
	});

	// it("Build valid js file on '$ enduro build'", function() {
	// 	var enduro_run = enduro.run(['testgulp']);
	// 	console.log(enduro_run)
	// 	expect(enduro_run).toEqual(false);
	// });

});