// * vendor dependencies
const expect = require('chai').expect

// * enduro dependencies
const local_enduro = require('../../index').quick_init()
const test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')

describe('Juicebox meta context', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'juicebox_meta_testfolder')
			.then(() => {
				enduro.config.juicebox_enabled = true
				enduro.config.meta_context_enabled = true
			})
	})

	it('should add meta last_edited property after save', function () {
		return flat.save('index', { new_content: true })
			.then(() => {
				return flat.load('index')
			})
			.then((test_object_context) => {
				expect(test_object_context).to.be.an('object')
				expect(test_object_context).to.have.property('meta')
				expect(test_object_context.meta).to.have.property('last_edited')
				expect(test_object_context.meta.last_edited).to.be.a('number')
			})
	})
})
