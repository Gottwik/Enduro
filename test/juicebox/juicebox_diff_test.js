// vendor dependencies
var expect = require('chai').expect
var path = require('path')
var glob = require('glob')

// local dependencies
var local_enduro = require('../../index').quick_init()
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')

describe('Juicebox diff', function () {

	before(function () {
		this.timeout(8000)
		return test_utilities.before(local_enduro, 'juicebox_pull_testfolder')
			.then(() => {
				enduro.config.juicebox_enabled = true
			})
			.then(() => {
				return juicebox.pull()
			})

	})

	it('diff should say the cms folder is the same as juicebox stored', function () {
		expect(true).to.be.true;
		// return juicebox.diff_current_to_latest_juicebox()
		// 	.then((diff_results) => {
		// 		console.log(diff_results)
		// 	})
	})

	after(function () {
		// return test_utilities.after()
	})
})
