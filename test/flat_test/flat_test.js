
// vendor dependencies
var expect = require('chai').expect

// local dependencies
var local_enduro = require('../../index').quick_init()
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('flat db data access', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'testfolder_flat_test', 'minimalistic')
	})

	it('should detect an existing flat object', function () {
		expect(flat.flat_object_exists('index')).to.equal(true)
	})

	it('should not detect an nonexisting flat object', function () {
		expect(flat.flat_object_exists('aegwa')).to.not.equal(true)
	})

	it('should convert relative path into full path', function () {
		var full_index_file = flat.get_full_path_to_flat_object('index')
		expect(flat_helpers.file_exists_sync(full_index_file)).to.equal(true) // validates the path conversion by checking if the file exists
	})

	it('should convert absolute path into relative', function () {
		var full_index_file = flat.get_full_path_to_flat_object('index')
		expect(flat.get_cms_filename_from_fullpath(full_index_file)).to.equal('index') // validates the path conversion by checking if the file exists
	})

	it('should be able to load a flat object', () => {
		return flat.load('index')
			.then((index_context) => {
				expect(index_context).to.be.an('object')
				expect(index_context).to.have.property('greeting')
				expect(index_context).to.have.property('superlative')
			})
	})

	it('should be able to save a flat object and then load it', () => {
		return flat.save('test_object', { test_context: 'inserted' })
			.then(() => {
				return flat.load('test_object')
			})
			.then((test_object_context) => {
				expect(test_object_context).to.be.an('object')
				expect(test_object_context).to.have.property('test_context')
				expect(test_object_context.test_context).to.equal('inserted')
			})
	})

	it('should be able to update a file with non-conflicting context', () => {
		return flat.save('update_test_object', { old_key: 'old_value' })
			.then(() => {
				return flat.upsert('update_test_object', { new_key: 'new_value' })
			})
			.then(() => {
				return flat.load('update_test_object')
			})
			.then((update_test_object_context) => {
				expect(update_test_object_context).to.have.property('old_key')
				expect(update_test_object_context).to.have.property('new_key')
				expect(update_test_object_context.old_key).to.equal('old_value')
				expect(update_test_object_context.new_key).to.equal('new_value')
			})

	})

	it('should be able to update a file with conflicting context, overwriting the previous context value', () => {
		return flat.save('update_test_object', { old_key: 'old_value' })
			.then(() => {
				return flat.upsert('update_test_object', { old_key: 'new_value' })
			})
			.then(() => {
				return flat.load('update_test_object')
			})
			.then((update_test_object_context) => {
				expect(update_test_object_context).to.have.property('old_key')
				expect(update_test_object_context.old_key).to.equal('new_value')
			})

	})

	it('should be able to add an item to array using the update functionality', () => {
		return flat.save('update_test_object', { list: [1, 2] })
			.then(() => {
				return flat.upsert('update_test_object', { list: [3] })
			})
			.then(() => {
				return flat.load('update_test_object')
			})
			.then((update_test_object_context) => {
				expect(update_test_object_context).to.have.property('list')
				expect(update_test_object_context.list).to.have.lengthOf(3)
			})
	})

	it('should keep old object if extending with an empty object', () => {
		return flat.save('update_test_object', { old_key: 'old_value' })
			.then(() => {
				return flat.upsert('update_test_object', {})
			})
			.then(() => {
				return flat.load('update_test_object')
			})
			.then((update_test_object_context) => {
				expect(update_test_object_context).to.deep.equal({ old_key: 'old_value' })
			})
	})

	it('should replace value with a nested object', () => {
		return flat.save('update_test_object', { parent: { child: { old_key: 'old_value' } } })
			.then(() => {
				return flat.upsert('update_test_object', { parent: { child: { old_key: 'new_value' } } })
			})
			.then(() => {
				return flat.load('update_test_object')
			})
			.then((update_test_object_context) => {
				expect(update_test_object_context).to.deep.equal({ parent: { child: { old_key: 'new_value' } } })
			})
	})

	it('should be able to extend array nested in an object', () => {

		var old_context = {
			root_object: {
				list: ['a', 'b', 'c']
			}
		}

		var updating_context = {
			root_object: {
				list: ['d'],
			}
		}

		var expected_merged_context = {
			root_object: {
				list: ['a', 'b', 'c', 'd'],
			}
		}

		return flat.save('update_test_object', old_context)
			.then(() => {
				return flat.upsert('update_test_object', updating_context)
			})
			.then(() => {
				return flat.load('update_test_object')
			})
			.then((update_test_object_context) => {
				expect(update_test_object_context).to.deep.equal(expected_merged_context)
			})
	})

	it('should be able to update nested object', () => {

		var old_context = {
			a: {
				b: {
					c: {
						old_key1: 'old_value1',
						old_key2: 'old_value2',
					}
				}
			}
		}

		var updating_context = {
			a: {
				b: {
					c: {
						old_key2: 'new_value2',
						new_key3: 'new_value3',
					}
				}
			}
		}

		var expected_merged_context = {
			a: {
				b: {
					c: {
						old_key1: 'old_value1',
						old_key2: 'new_value2',
						new_key3: 'new_value3',
					}
				}
			}
		}

		return flat.save('update_test_object', old_context)
			.then(() => {
				return flat.upsert('update_test_object', updating_context)
			})
			.then(() => {
				return flat.load('update_test_object')
			})
			.then((update_test_object_context) => {
				expect(update_test_object_context).to.deep.equal(expected_merged_context)
			})
	})

	after(function () {
		return test_utilities.after()
	})
})

describe('flat db object feature detection', function () {

	it('should detect if flat object has a page associated', () => {
		// standard use cases
		expect(flat.has_page_associated('index')).to.be.true
		expect(flat.has_page_associated('global/global')).to.be.false

		// curveballs
		expect(flat.has_page_associated('gallery/global')).to.be.true
		expect(flat.has_page_associated('1/2/3/4/5')).to.be.true
	})

	it('should detect that if flat object is deletable or not', () => {
		// standard use cases
		expect(flat.is_deletable('index')).to.be.false
		expect(flat.is_deletable('generators/blog/blog_entry')).to.be.true

		// curveballs
		expect(flat.is_deletable('index/generators')).to.be.false
	})

	it('should convert flat object path into a valid url', () => {
		expect(flat.url_from_filename('index')).to.be.equal('')
		expect(flat.url_from_filename('gallery')).to.be.equal('gallery')
		expect(flat.url_from_filename('gallery/lego')).to.be.equal('gallery/lego')
		expect(flat.url_from_filename('generators/blog/blog_entry')).to.be.equal('blog/blog_entry')
	})

	it('should convert flat object path into a valid file path', () => {
		expect(flat.filepath_from_filename('index')).to.be.equal('index')
		expect(flat.filepath_from_filename('gallery')).to.be.equal('gallery/index')
		expect(flat.filepath_from_filename('gallery/lego')).to.be.equal('gallery/lego/index')
		expect(flat.filepath_from_filename('generators/blog/blog_entry')).to.be.equal('blog/blog_entry/index')
	})

	it('should detect a generator', () => {
		// standard use cases
		expect(flat.is_generator('generators/blog/blog_entry')).to.be.true
		expect(flat.is_generator('gallery')).to.be.false

		// curveballs
		expect(flat.is_generator('gallery/generators')).to.be.false
		expect(flat.is_generator('genera')).to.be.false
	})

})
