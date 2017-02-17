// * ———————————————————————————————————————————————————————— * //
// * 	theme manager
// *	downloads a theme and extracts it into a new folder
// * ———————————————————————————————————————————————————————— * //
var theme_manager = function () {}

// local dependencies

// vendor dependencies
var Promise = require('bluebird')
var request = require('request')
var logger = require(ENDURO_FOLDER + '/libs/logger')
var zlib = require('zlib')
var fs = require('fs')
var tar = require('tar')

// Goes through the pages and renders them
theme_manager.prototype.create_from_theme = function (theme_name) {
	var self = this

	return new Promise(function (resolve, reject) {
		request(THEME_MANAGER_LINK, (err, themes_response) => {
			if (err) { return reject(err) }

			var themes = JSON.parse(themes_response.body)

			if (!(theme_name in themes)) {
				self.list_themes(themes)
				return resolve()
			}

			logger.init('Cloning ' + theme_name + ' theme')

			var theme = themes[theme_name]

			request('https://github.com/Gottwik/enduro_mirror/archive/master.tar.gz')
				.pipe(zlib.createUnzip())
				.pipe(tar.Extract(''))

			console.log(theme)
			logger.end()
		})
	})
}

theme_manager.prototype.list_themes = function (themes) {
	logger.init('found themes')
	logger.log('choose from themes below')
	_.forEach(themes, (theme, theme_name) => {
		logger.line()
		logger.twolog(theme_name)
		logger.log(theme.description)

	})
	logger.end()
}

module.exports = new theme_manager()
