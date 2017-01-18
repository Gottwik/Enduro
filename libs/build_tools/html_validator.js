// * ———————————————————————————————————————————————————————— * //
// * 	Html validator
// *	checks if the html is valid
// * ———————————————————————————————————————————————————————— * //

var htmlvalidator = function () {}

var validator = require('html-validator')
var async = require('async')
var fs = require('fs')
var glob = require('glob')

var logger = require(ENDURO_FOLDER + '/libs/logger')

// Creates all subdirectories neccessary to create the file in filepath
htmlvalidator.prototype.init = function (gulp) {
	gulp.task('htmlvalidator', function (cb) {
		glob(CMD_FOLDER + '/pages/**/*.hbs', function (err, files) {
			if (err) {
				logger.err(err)
			}

			logger.init('Validating pages')

			files = files.map((file) => {
				return file.match('/pages/(.*).hbs')[1]
			})

			async.each(files, function (pagepath, callback) {
				var src_path = CMD_FOLDER + '/_src/' + pagepath + '.html'

				fs.readFile(src_path, 'utf8', function (err, data) {
					if (err) { return console.log(err) }

					validator({data: data, validator: 'http://html5.validator.nu'}, function (error, data) {
						if (error) {
							throw error
						}
						data = JSON.parse(data)
						if (data['messages'] && data['messages'].length == 0) {
							logger.twolog('✓ ' + pagepath, 'ok')
						} else {
							logger.twoerr('✗ ' + pagepath, 'not ok')
						}
						callback()
					})

				})
			}, () => {
				// After all global files are loaded
				logger.end()
				cb()
			})

		})
	})

	return 'htmlvalidator'
}

module.exports = new htmlvalidator()
