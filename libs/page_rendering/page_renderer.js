// * ———————————————————————————————————————————————————————— * //
// * 	enduro render
// *	renders individual page based on source template, context and culture
// * ———————————————————————————————————————————————————————— * //
var page_renderer = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var extend = require('extend')
var path = require('path')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var babel = require(ENDURO_FOLDER + '/libs/babel/babel')
var globalizer = require(ENDURO_FOLDER + '/libs/globalizer/globalizer')

// Renders individual files
page_renderer.prototype.render_file = function (file, context_filename, culture, dest_path) {
	var self = this

	return new Promise(function (resolve, reject) {

		// where will the generated page be saved
		var destination_path = path.join(culture, dest_path)

		flat_file_handler.load(context_filename)
			.then((context) => {
				return self.render_file_by_context(file, context, culture)
			}, () => {
				kiska_logger.err('something went wrong attempting to locate file: ' + file)
				throw new Error('abort promise chain')
			})
			.then((output) => {
				// Makes sure the target directory exists
				enduro_helpers.ensureDirectoryExistence(CMD_FOLDER + '/_src/' + destination_path)
					.then(function () {
						// Attempts to export the file
						fs.writeFile(CMD_FOLDER + '/_src/' + destination_path + '.html', output, function (err) {
							if (err) { return kiska_logger.err_block(err) }

							kiska_logger.twolog('page ' + destination_path, 'created', 'enduro_render_events')
							resolve()
						})
					})
			})
	})
}

page_renderer.prototype.render_file_by_context = function (file, context, culture) {
	return new Promise(function (resolve, reject) {
	// Attempts to read the file
		fs.readFile(file, 'utf8', function (err, raw_template) {
			if (err) { return kiska_logger.err_block(err) }

			// Creates a template
			var template = __templating_engine.compile(raw_template)

			// Stores file name and extension
			// Note that subdirecotries are included in the name
			var file_regex_match = file.match(/pages\/(.*)\.([^\\/]+)$/)
			var filename = file_regex_match[1]

			// gets pagename
			var pagename = file.match(/([^\/]*)\.[^\.]*$/)[1]

			// If global data exists extends the context with it
			if (typeof __data !== 'undefined') {
				extend(true, context, __data)
			}

			// Add pagename to the context
			extend(true, context, {_meta: {pagename: pagename, culture: culture}})

			// adds in-cms networking
			globalizer.globalize(context)

			markdownifier.markdownify(context)

			// renders the template with the culturalized context
			var output = 'Error processing page'
			try {
				output = template(babel.culturalize(context, culture))
			} catch (e) {
				kiska_logger.err_block('Page: ' + filename + '\n' + e.message)
			}

			// output raw templates if render_templates setting is set to false. Defaults to true
			if (!config.render_templates) {
				output = raw_template
			}

			resolve(output)
		})
	})
}

page_renderer.prototype.render_file_by_filename_extend_context = function (filename, extended_context) {
	var self = this
	extended_context = extended_context || {}

	var file = get_template_by_filename(filename)
	var culture = config.cultures[0]

	return flat_file_handler.load(filename)
		.then((context) => {
			extend(true, context, extended_context)
			return self.render_file_by_context(file, context, culture)
		})

}

page_renderer.prototype.render_file_by_filename_replace_context = function (filename, context) {
	var self = this
	context = context || {}

	var file = get_template_by_filename(filename)
	var culture = config.cultures[0]

	return self.render_file_by_context(file, context, culture)
}

function get_template_by_filename (filename) {

	var splitted_filename = filename.split(path.sep)
	if (splitted_filename.indexOf('generators') + 1) {
		filename = splitted_filename.slice(0, -1).join(path.sep)
	}

	return path.join(CMD_FOLDER, 'pages', filename + '.hbs')
}

module.exports = new page_renderer()
