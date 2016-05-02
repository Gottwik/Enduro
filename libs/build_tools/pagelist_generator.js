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
	gulp.task('pagelist_generator', function(cb) {
		glob(CMD_FOLDER + '/pages/**/*.hbs', function (err, files) {

			var pagelist = {}

			// helper function to build the pagelist
			function build(pagepath, partial_pages, fullpath) {
				if(pagepath.length == 1){
					partial_pages[pagepath[0]] = {type: 'page', fullpath: '/' + fullpath.join('/')}
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

module.exports = new pagelist_generator()