// * ———————————————————————————————————————————————————————— * //
// * 	Pagelist Generator
// *	Goes through all the pages and generates a json from them
// * ———————————————————————————————————————————————————————— * //

var pagelist_generator = function () {};

var Promise = require('bluebird')
var fs = require('fs')
var glob = require("glob")
var stringify_object = require('stringify-object')
var extend = require('extend')

var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

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
	return new Promise(function(resolve, reject){
		glob(CMD_FOLDER + '/pages/**/*.hbs', function (err, files) {
			var pagelist = {}
			files.forEach((file) => {
				var page = {}
				page.type = 'page'
				page.fullpath = file
				page.path = file.match('/pages/(.*)\.hbs')[1]
				page.name = page.path.split('/').slice(-1)[0]
				page.label = capitalize(page.path.split('/').slice(-1)[0])

				pagelist[page.name] = page
			})

			resolve(pagelist)
		})
	})
}

pagelist_generator.prototype.get_flat_datalist = () => {
	return new Promise(function(resolve, reject){
		glob(CMD_FOLDER + '/cms/global/**/*.js', function (err, files) {
			var dataset_list = {}
			files.forEach((file) => {
				var dataset = {}
				dataset.type = 'dataset'
				dataset.fullpath = file
				dataset.path = file.match('/cms/global/(.*)\.js')[1]
				dataset.name = dataset.path.split('/').slice(-1)[0]
				dataset.label = capitalize(dataset.path.split('/').slice(-1)[0])

				dataset_list[dataset.name] = dataset
			})

			resolve(dataset_list)
		})
	})
}

function capitalize(input) {
	return input[0].toUpperCase() + input.substring(1)
}

module.exports = new pagelist_generator()