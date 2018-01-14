// * ———————————————————————————————————————————————————————— * //
// * 	juice make new
// *
// * 	updated all cms files to the current timestamp
// * 	effectivelly doing a force push, since these files will be newer than anything in juicebox
// * ———————————————————————————————————————————————————————— * //
const juice_make_new = function () {}

// * vendor dependencies
const Promise = require('bluebird')

// * enduro dependencies
const pagelist_generator = require(enduro.enduro_path + '/libs/build_tools/pagelist_generator')
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')
const logger = require(enduro.enduro_path + '/libs/logger')

// * ———————————————————————————————————————————————————————— * //
// * 	make new
// * ———————————————————————————————————————————————————————— * //
juice_make_new.prototype.make_new = function () {
	logger.init('making cms files new')
	logger.loading('getting list of files to update')
	return pagelist_generator.generate_cms_list()
		.then((pagelist) => {
			logger.loaded()

			let upsert_promises = []

			logger.twolog('cms files to update', pagelist.flat.length.toString())
			logger.loading('updating files')

			pagelist.flat
				.map((page) => { return page.fullpath })
				.forEach((context_file) => {
					upsert_promises.push(flat.upsert(context_file, {
						meta: {
							last_edited: flat_helpers.get_current_timestamp()
						}
					}))
				})

			return Promise.all(upsert_promises)
		})
		.then(() => {
			logger.loaded()
			logger.end()
		})
}

module.exports = new juice_make_new()
