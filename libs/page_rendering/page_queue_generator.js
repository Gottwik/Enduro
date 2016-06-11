// * ———————————————————————————————————————————————————————— * //
// * 	enduro render
// *	renders individual page based on source template, context and culture
// * ———————————————————————————————————————————————————————— * //
var page_queue_generator = function () {}

// vendor dependencies
var glob = require("glob-promise")

// local dependencies
var babel = require(ENDURO_FOLDER + '/libs/babel/babel')

// Renders individual files
page_queue_generator.prototype.generate_pagelist = function() {
	return new Promise(function(resolve, reject){

		// Reads config file and gets cultures
		babel.get_cultures()
			.then((cultures) => {

				// save current cultures
				config.cultures = cultures

				// gets all the pages
				return glob(CMD_FOLDER + '/pages/**/*.hbs')
			})
			.then((files) => {

				var pages_to_render = []

				for(f in files) {
					for(c in config.cultures) {

						// if regular page
						if(!(files[f].indexOf('pages/generators') + 1)) {

							var page_to_render = {}

							// absolute path to page template file
							page_to_render.file = files[f]

							// relative, 'flat' path to cms file
							page_to_render.context_file = files[f].match(/pages\/(.*)\.([^\\/]+)$/)[1]

							// culture string
							page_to_render.culture = config.cultures[c]

							// push to pages to render list
							pages_to_render.push(page_to_render)
						}
					}
				}

				resolve(pages_to_render)

			})
	})
}

module.exports = new page_queue_generator()