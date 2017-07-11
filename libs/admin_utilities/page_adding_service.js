// * ———————————————————————————————————————————————————————— * //
// * 	Handles adding new page
// * ———————————————————————————————————————————————————————— * //
var page_adding_service = function () {}

// vendor dependencies
const path = require('path')
const _ = require('lodash')

// local dependencies
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')
const pagelist_generator = require(enduro.enduro_path + '/libs/build_tools/pagelist_generator')

// adds a new page to a generator - basically creates a .js file in the generator folder
page_adding_service.prototype.new_generator_page = function (new_pagename, generator) {
	// try to load a template generator - templates are named same as generator
	// 
	return get_new_generator_context(generator)
		.then((template_content) => {
			return flat.save(path.join('generators', generator, new_pagename), template_content)
		})
		.then(() => {
			return pagelist_generator.generate_cms_list()
		})
		.then((cmslist) => {
			return pagelist_generator.save_cms_list(cmslist)
		})
}

// yea, this is not really implemented yet ¯\_(ツ)_/¯
page_adding_service.prototype.delete_page = function (pagename) {
	return new Promise(function (resolve, reject) {
		resolve()
	})
}

function get_new_generator_context (generator) {
	return flat.load(path.join('generators', generator, generator))
		.then((template_content) => {

			// check if generator template exists
			if (_.isEmpty(template_content)) {

				// there is no template, let's get the first page there is
				return pagelist_generator.get_cms_list()
					.then((cms_list) => {
						const all_pages = _.filter(cms_list.structured[generator], { page: true })
						if (all_pages.length > 0) {
							return flat.load(all_pages[0].fullpath)
						} else {
							return {}
						}
					})
			} else {
				return template_content
			}
		})
}

module.exports = new page_adding_service()
