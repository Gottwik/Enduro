// * ———————————————————————————————————————————————————————— * //
// * 	Components handler
// *	Loads components. Note that even if component is stored
// *	in subdirectory, it's name will be just the file name
// * ———————————————————————————————————————————————————————— * //
const components_handler = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const fs = require('fs')
const async = require('async')
const glob = require('glob')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')

// * ———————————————————————————————————————————————————————— * //
// * 	read components
// * 	reads all components from /components folder
// *
// *	@return {promise} - empty promise
// * ———————————————————————————————————————————————————————— * //
components_handler.prototype.read_components = function () {
	return new Promise(function (resolve, reject) {

		const components_path = enduro.project_path + '/components/**/*.hbs'

		// fetches the files
		glob(components_path, function (err, files) {
			if (err) {
				logger.err_block(err)
				return reject()
			}

			// async goes through all files
			async.each(files, function (file, callback) {

				// stores file name and file extension
				const fileReg = file.match(/([^\\/]+)\.([^\\/]+)$/)
				const filename = fileReg[1]

				// reads the file. @data stores the component's raw contents
				fs.readFile(file, 'utf8', function (err, data) {
					if (err) {
						logger.err_block(err)
						return reject(err)
					}

					// register the component
					enduro.templating_engine.registerPartial(filename.toLowerCase(), data)
					logger.twolog('component ' + filename, 'registered', 'enduro_render_events')
					callback()
				})
			}, function () {

				// after all components are loaded
				logger.line('enduro_render_events')
				resolve()
			})
		})
	})
}

module.exports = new components_handler()
