// vendor dependencies
var expect = require('chai').expect
var request = require('request')
var async = require('async')
var _ = require('lodash')

// local dependencies
var local_enduro = require('../../index')
var ab_tester = require(enduro.enduro_path + '/libs/ab_testing/ab_tester')

describe('A/B testing', function () {

	// Create a new project
	before(function (done) {
		this.timeout(3000)
		var ab_testing_foldername = 'testproject_abtesting'
		local_enduro.run(['create', ab_testing_foldername, 'test'])
			.then(() => {
				// navigate inside new project
				enduro.project_path = enduro.project_path + '/' + ab_testing_foldername
				local_enduro.run(['start'], [])
					.then(() => {
						done()
					})
			}, () => {
				done(new Error('Failed to create new project'))
			})
	})

	// list looks like this
	//	{
	//		index: [
	//			{
	//				page: 'index'
	//			}, {
	//				page: 'index@ab'
	//			}, {
	//				page: 'index@bb'
	//			}
	//		],
	//		test: [
	//			{
	//				page: 'test'
	//	 		}, {
	//		 		page: 'test@bigbutton'
	//	 		}
	//		]
	// }
	it('should make a a/b list', function () {
		return ab_tester.get_ab_list()
			.then((ab_testing_list) => {
				expect(ab_testing_list).to.not.be.empty
				expect(ab_testing_list.index[0].page).to.equal('index')
			})
	})

	it('should serve different at least one different page out of 50 requests', function (done) {

		var responses = []

		async.each(new Array(50), function (file, callback) {
			request('http://localhost:5000/', function (error, response, body) {
				if (error) { console.log(error) }
				responses.push(body)
				callback()
			})
		}, () => {
			expect(Object.keys(_.groupBy(responses))).to.have.length.above(2)
			done()
		})
	})

	// navigate back to testfolder
	after(function (done) {
		local_enduro.server_stop(() => {
			enduro.project_path = process.cwd() + '/testfolder'
			done()
		})
	})

})
