// * ———————————————————————————————————————————————————————— * //
// * 	pagelist generator
// *	goes through all the pages and generates a json from them
// *
// *	pagelist json is saved and get_cms_list() will quickly retrieve it without
// *	generation it again
// *
// *	pagelist generator will generate two lists - a structured and flat list
// * ———————————————————————————————————————————————————————— * //
var pagelist_generator = function () {};

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs-extra')
var glob = require('glob')
var stringify_object = require('stringify-object')
var extend = require('extend')
var path = require('path')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var format_service = require(ENDURO_FOLDER + '/libs/services/format_service')

// constants
var PAGELIST_DESTINATION = CMD_FOLDER + '/_src/_prebuilt/cmslist.json'


// * ———————————————————————————————————————————————————————— * //
// * 	init
// *
// * 	registeres generating and saving the pagelist to gulp
// *	additionaly it will expand the global data with the pagelist
// *	@param {object} gulp - gulp to register the task into
// *	@return {} - will call an empty callback
// * ———————————————————————————————————————————————————————— * //
pagelist_generator.prototype.init = function(gulp) {
	var self = this

	var pagelist_generator_task_name = 'pagelist_generator'

	// adds task to gulp
	gulp.task(pagelist_generator_task_name, function(cb) {

		// generates cmslist
		self.generate_cms_list()
			.then((cmslist) => {

				// Extends global data with currently loaded data
				extend(true, __data.global, {cmslist: cmslist})

				return self.save_cms_list(cmslist)
			})
			.then(() => {
				cb()
			})
	})

	// returns name of the task so it can be stored and called comfortably
	return pagelist_generator_task_name
}


// * ———————————————————————————————————————————————————————— * //
// * 	generate cms list
// *
// * 	generates list of pages with global datasets and generators
// *	@return {promise} - promise with cmslist
// * ———————————————————————————————————————————————————————— * //
pagelist_generator.prototype.generate_cms_list = function() {
	return new Promise(function(resolve, reject) {
		glob(CMD_FOLDER + '/cms/**/*.js', function (err, files) {
			if(err) { console.log(err) }

			var pagelist = {}
			var flat_pagelist = []

			// helper function to build the pagelist
			function build(pagepath, partial_pages, fullpath) {

				// decides if pagepath is folder or file
				if(pagepath.length == 1) {

					var page = {}
					page.page = true
					page.fullpath = '/' + fullpath.join('/')
					page.name = format_service.prettify_string(pagepath[0])

					// mark generator template as hidden
					if(fullpath[0] == 'generators' && fullpath[1] == fullpath[2]) {
						page.hidden = true
					}

					partial_pages[pagepath[0]] = page
					flat_pagelist.push(page)
				} else {

					// remove templates from pagelist
					if(pagepath[0] == 'templates') {
						return
					}

					var folder = {}
					folder.folder = true
					folder.fullpath = '/' + fullpath.join('/')
					folder.name = format_service.prettify_string(pagepath[0])

					if(fullpath[0] == 'generators' && pagepath.length != fullpath.length) {
						folder.generator = true
					}

					// global and generators receive special treatment and the subfolders are not created
					if(folder.name.toLowerCase() == 'global' || folder.name.toLowerCase() == 'generators') {
						build(pagepath.slice(1), partial_pages, fullpath)
					} else {

						// adds the folder to the tree if it's not there yet
						if(!(pagepath[0] in partial_pages)) {
							partial_pages[pagepath[0]] = folder
						}

						build(pagepath.slice(1), partial_pages[pagepath[0]], fullpath)
					}

				}
			}

			// goes throught the glob, crops the filename and builds a pagelist
			files.map((file) => {
				return file.match('/cms/(.*)\.js')[1].split('/')
			}).forEach((pagepath) => {
				build(pagepath, pagelist, pagepath)
			})

			composed_pagelist = {
				structured: pagelist,
				flat: flat_pagelist
			}


			resolve(composed_pagelist)
		})
	})
}


// * ———————————————————————————————————————————————————————— * //
// * 	save cms list
// *
// * 	saves the cmslist to predefined path
// *	@return {promise} - promise with cmslist
// * ———————————————————————————————————————————————————————— * //
pagelist_generator.prototype.save_cms_list = function(cmslist) {
	return new Promise(function(resolve, reject) {
		// Saves the cmslist into a specified file
		enduro_helpers.ensureDirectoryExistence(PAGELIST_DESTINATION)
			.then(() => {
				fs.writeFile(PAGELIST_DESTINATION, JSON.stringify(cmslist), function(err) {
					if(err) { console.log(err) }
					resolve(cmslist)
				})
			})
	})
}


// * ———————————————————————————————————————————————————————— * //
// * 	get cms list
// *
// * 	tries to read the cms pregenerated file and returns it
// *	if the pregenerated file is not present it generates a new one
// *	@return {promise} - promise with cmslist
// * ———————————————————————————————————————————————————————— * //
pagelist_generator.prototype.get_cms_list = function() {
	var self = this
	return new Promise(function(resolve, reject) {
		if(enduro_helpers.fileExists(PAGELIST_DESTINATION)) {
			fs.readJson(PAGELIST_DESTINATION, function(err, cmslist) {
				resolve(cmslist)
			})
		} else {
			return self.generate_cms_list()
				.then((cmslist) => {
					return save_cms_list(cmslist)
				})
		}
	})
}


// * ———————————————————————————————————————————————————————— * //
// * 	pregenerated pagelist path
// *
// * 	global acccessible pagelist path
// *	@return {promise} - promise with cmslist
// * ———————————————————————————————————————————————————————— * //
pagelist_generator.prototype.pregenerated_pagelist_path = PAGELIST_DESTINATION

module.exports = new pagelist_generator()