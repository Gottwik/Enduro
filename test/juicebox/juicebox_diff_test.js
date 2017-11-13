// * vendor dependencies
const expect = require('chai').expect
const path = require('path')
const glob = require('glob')

// * enduro dependencies
const local_enduro = require('../../index').quick_init()
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')

describe('Juicebox diff', () => {

	before(function () {
		this.timeout(8000)
		return test_utilities.before(local_enduro, 'juicebox_pull_testfolder')
			.then(() => {
				enduro.config.juicebox_enabled = true
				enduro.config.meta_context_enabled = true
			})
			.then(() => {
				return juicebox.pull()
			})
	})

	it('diff should say the cms folder is the same as juicebox stored', () => {
		return juicebox.diff_current_to_latest_juicebox()
			.then((diff_results) => {
				expect(diff_results.differences).to.equal(0);
			})
	})

	it('diff should detect changed file', () => {
		return flat.save('index', { new_content: 'definitely new stuff' })
			.then(() => {
				return juicebox.diff_current_to_latest_juicebox()
			})
			.then((diff_results) => {
				expect(diff_results.differences).to.equal(1);
			})
	})

	it('diff should detect one new file', () => {
		return flat.save('test_object', { test_context: 'inserted' })
			.then(() => {
				return juicebox.diff_current_to_latest_juicebox()
			})
			.then((diff_results) => {
				expect(diff_results.differencesFiles).to.equal(1);
			})
	})

	it('diff should detect one new folder', () => {
		return flat.save('new_folder/test_object', { test_context: 'inserted' })
			.then(() => {
				return juicebox.diff_current_to_latest_juicebox()
			})
			.then((diff_results) => {
				expect(diff_results.differencesFiles).to.equal(2);
				expect(diff_results.differencesDirs).to.equal(1);
			})
	})

	after(() => {
		return test_utilities.after()
	})
})
