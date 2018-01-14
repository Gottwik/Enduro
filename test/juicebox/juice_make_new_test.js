// * vendor dependencies
const expect = require('chai').expect

// * enduro dependencies
const local_enduro = require('../../index').quick_init()
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')
const juice_make_new = require(enduro.enduro_path + '/libs/juicebox/juice_make_new')
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

describe('Juicebox make new', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'juicebox_make_new_testfolder')
			.then(() => {
				enduro.config.juicebox_enabled = true
				enduro.config.meta_context_enabled = true
			})
	})

	it('add updated timestamp to index context file', function () {

		return juice_make_new.make_new()
			.then(() => {
				return flat.load('index')
			})
			.then((context) => {

				const now = flat_helpers.get_current_timestamp()

				expect(context).to.have.property('meta')
				expect(context.meta).to.have.property('last_edited')
				expect(context.meta.last_edited).to.be.within(now - 1000, now + 1000)
			})
	})
})
