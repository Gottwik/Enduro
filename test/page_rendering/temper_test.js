// // vendor dependencies
// var expect = require('chai').expect
// var path = require('path')

// // local dependencies
// var enduro = require(enduro.enduro_path + '/index')
// var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

// // only test if s3 is enabled

// describe('cli upload', function () {
// 	this.timeout(5000)
// 	// Create a new project
// 	before(function (done) {
// 		var test_project_name = 'temper_testproject'

// 		local_enduro.run(['create', test_project_name, 'test'])
// 			.then(() => {
// 				// navigate inside new project
// 				enduro.project_path  = path.join(enduro.project_path, test_project_name)
// 				done()
// 			}, () => {
// 				done(new Error('Failed to create new project'))
// 			})
// 	})

// 	it('reject if no filename is provided', function (done) {

// 		local_enduro.run(['upload'])
// 			.then(() => {
// 				done(new Error('should have rejected'))
// 			}, () => {
// 				done()
// 			})
// 	})


// 	// navigate back to testfolder
// 	after(function () {
// 		enduro.project_path  = process.cwd() + '/testfolder'
// 	})
// })
