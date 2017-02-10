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

// Goes through the pages and renders them
theme_manager.prototype.create_from_theme = function (theme_name) {
	return new Promise(function (resolve, reject) {
		request(THEME_MANAGER_LINK, (err, themes_response) => {
			if (err) { return reject(err) }

			var themes = JSON.parse(themes_response.body)

			if (!(theme_name in themes)) {
				return reject()
			}

			logger.init('Cloning ' + theme_name + ' theme')

			var theme = themes[theme_name]

			console.log(theme)
			logger.end()
		})
	})
}

module.exports = new theme_manager()
