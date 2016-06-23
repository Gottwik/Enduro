// * ———————————————————————————————————————————————————————— * //
// * 	Pagelist Generator
// *	Goes through all the pages and generates a json from them
// * ———————————————————————————————————————————————————————— * //
var pagelist_generator = function () {};

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var glob = require("glob")
var stringify_object = require('stringify-object')
var extend = require('extend')
var path = require("path")

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var format_service = require(ENDURO_FOLDER + '/libs/services/format_service')

// constants
var PAGELIS_DESTINATION = CMD_FOLDER + '/_src/_prebuilt/pagelist.json'

// Creates all subdirectories neccessary to create the file in filepath
pagelist_generator.prototype.init = function(gulp) {
	var self = this

	gulp.task('pagelist_generator', function(cb) {
		self.get_pagelist()
			.then((pagelist) => {

				// Extends global data with currently loaded data
				extend(true, __data.global, {pagelist: pagelist})

				// Saves the pagelist into a specified file
				enduro_helpers.ensureDirectoryExistence(PAGELIS_DESTINATION)
					.then(() => {
						fs.writeFile( PAGELIS_DESTINATION , JSON.stringify(pagelist), function(err) {
							if(err) { console.log(err) }
							cb()
						})
					})
			})
	})

	return 'pagelist_generator'
}

pagelist_generator.prototype.get_pagelist = function() {
	return new Promise(function(resolve, reject){
		glob(CMD_FOLDER + '/pages/**/*.hbs', function (err, files) {
			if(err) { console.log(err) }

			var pagelist = {}

			// helper function to build the pagelist
			function build(pagepath, partial_pages, fullpath) {
				if(pagepath.length == 1){

					var page = {}
					page.type = 'page'
					page.fullpath = '/' + fullpath.join('/')
					page.name = format_service.prettify_string(pagepath[0])

					partial_pages[pagepath[0]] = page
				} else {
					if(!(pagepath[0] in partial_pages)){
						partial_pages[pagepath[0]] = {}
					}
					build(pagepath.slice(1), partial_pages[pagepath[0]], fullpath)
				}
			}

			// goes throught the glob, crops the filename and builds a pagelist
			files.map((file) => {
				return file.match('/pages/(.*)\.hbs')[1].split('/')
			}).forEach((pagepath) => {
				build(pagepath, pagelist, pagepath)
			})

			resolve(pagelist)
		})
	})
}

pagelist_generator.prototype.get_cms_list = function() {
	return new Promise(function(resolve, reject){
		glob(CMD_FOLDER + '/cms/**/*.js', function (err, files) {
			if(err) { console.log(err) }

			var pagelist = {}

			// helper function to build the pagelist
			function build(pagepath, partial_pages, fullpath) {
				if(pagepath.length == 1){

					var page = {}
					page.page = true
					page.fullpath = '/' + fullpath.join('/')
					page.name = format_service.prettify_string(pagepath[0])

					// mark generator template as hidden
					if(fullpath[0] == 'generators' && fullpath[1] == fullpath[2]) {
						page.hidden = true
					}

					partial_pages[pagepath[0]] = page
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

					// change global name
					if(folder.name == 'Global') {
						folder.name = 'Datasets'
					}

					// change generators name
					if(folder.name == 'Generators') {
						folder.name = 'Multipages'
					}

					if(!(pagepath[0] in partial_pages)){
						partial_pages[pagepath[0]] = folder
					}
					build(pagepath.slice(1), partial_pages[pagepath[0]], fullpath)
				}
			}

			// goes throught the glob, crops the filename and builds a pagelist
			files.map((file) => {
				return file.match('/cms/(.*)\.js')[1].split('/')
			}).forEach((pagepath) => {
				build(pagepath, pagelist, pagepath)
			})

			resolve(pagelist)
		})
	})
}


function capitalize(input) {
	return input[0].toUpperCase() + input.substring(1)
}

module.exports = new pagelist_generator()