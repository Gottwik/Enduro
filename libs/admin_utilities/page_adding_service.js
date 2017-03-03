// * ———————————————————————————————————————————————————————— * //
// * 	Handles adding new page
// * ———————————————————————————————————————————————————————— * //
var page_adding_service = function () {}

// vendor dependencies
var path = require('path')

// local dependencies
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')
var pagelist_generator = require(enduro.enduro_path + '/libs/build_tools/pagelist_generator')

page_adding_service.prototype.new_generator_page = function (new_pagename, generator) {
	return flat.load(path.join('generators', generator, generator))
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

page_adding_service.prototype.delete_page = function (pagename) {
	return new Promise(function (resolve, reject) {
		resolve()
	})
}

module.exports = new page_adding_service()
