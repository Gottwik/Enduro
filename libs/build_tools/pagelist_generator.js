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
					page.name = pagepath[0]

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

pagelist_generator.prototype.get_flat_pagelist = () => {
	return get_resource_list('pages/**/*.hbs')
}

pagelist_generator.prototype.get_flat_datalist = () => {
	return get_resource_list('cms/global/**/*.js')
}

pagelist_generator.prototype.get_flat_generatorlist = () => {
	return get_resource_list('cms/generators/**/*.js')
}


function get_resource_list(resource_location) {
	return new Promise(function(resolve, reject){
		glob(path.join(CMD_FOLDER, resource_location), function (err, files) {
			if(err) { console.log(err) }

			var resource_list = {}
			files.forEach((file) => {

				var resource_base = resource_location.split('**')[0]

				var resource = {}
				resource.type = 'resource'
				resource.fullpath = file

				resource.path = file.match(new RegExp('\/' + resource_base + '(.*)\\..*'))[1]
				resource.name = resource.path.split('/').slice(-1)[0]
				resource.label = capitalize(resource.path.split('/').slice(-1)[0])

				resource_list[resource.name] = resource
			})
			console.log(resource_list)
			resolve(resource_list)
		})
	})
}

function capitalize(input) {
	return input[0].toUpperCase() + input.substring(1)
}

module.exports = new pagelist_generator()