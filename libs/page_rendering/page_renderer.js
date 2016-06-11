// * ———————————————————————————————————————————————————————— * //
// * 	enduro render
// *	renders individual page based on source template, context and culture
// * ———————————————————————————————————————————————————————— * //
var page_renderer = function () {}

// vendor dependencies
var fs = require('fs')
var extend = require('extend')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var babel = require(ENDURO_FOLDER + '/libs/babel/babel')
var globalizer = require(ENDURO_FOLDER + '/libs/globalizer/globalizer')

// Renders individual files
page_renderer.prototype.render_file = function(file, context, culture) {
	return new Promise(function(resolve, reject){
		console.log(context)

		// Stores file name and extension
		// Note that subdirecotries are included in the name
		var file_regex_match = file.match(/pages\/(.*)\.([^\\/]+)$/)
		var filename = file_regex_match[1]

		// gets pagename
		var pagename = file.match(/([^\/]*)\.[^\.]*$/)[1]

		// where will the generated page end
		var destination_path = culture + '/' + filename

		// special case for the landing page to work
		// if(filename == 'index' && culture != '') {
		// 	destination_path = culture
		// }

		// Attempts to read the file
		fs.readFile(file, 'utf8', function (err,data) {
			if (err) { return kiska_logger.err_block(err) }

			// Creates a template
			var template = __templating_engine.compile(data)

			// Loads context if cms file with same name exists
			flat_file_handler.load(filename)
				.then((context) => {
					// If global data exists extends the context with it
					if(typeof __data !== 'undefined') {
						extend(true, context, __data)
					}

					// Add pagename to the context
					extend(true, context, {_meta: {pagename: pagename, culture: culture}})

					// adds in-cms networking
					globalizer.globalize(context)

					// Renders the template with the culturalized context
					var output = "Error processing page"
					try {
						output = template(babel.culturalize(context, culture))
					}
					catch(e) {
						kiska_logger.err_block('Page: ' + filename + '\n' + e.message)
					}

					// Output raw templates if render_templates setting is set to false
					if(!config.render_templates) {
						output = data
					}

					// Makes sure the target directory exists
					enduro_helpers.ensureDirectoryExistence(CMD_FOLDER + '/_src/' + destination_path)
						.then(function() {
							// Attempts to export the file
							fs.writeFile(CMD_FOLDER + '/_src/' + destination_path + '.html', output, function(err) {
								if (err) { return kiska_logger.err_block(err) }

								kiska_logger.twolog('page ' + destination_path, 'created', 'enduro_render_events')
								resolve()
							})
						})
				},() => {
					kiska_logger.err('something went wrong attempting to locate file: ' + filename)
				})

		})
	})
}

module.exports = new page_renderer()