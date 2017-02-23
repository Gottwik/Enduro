// * ———————————————————————————————————————————————————————— * //
// * 	theme manager
// *	downloads a theme and extracts it into a new folder
// * ———————————————————————————————————————————————————————— * //
var theme_manager = function () {}

// local dependencies
var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var flat = require(ENDURO_FOLDER + '/libs/flat_db/flat')

// vendor dependencies
var Promise = require('bluebird')
var request = require('request-promise')
var logger = require(ENDURO_FOLDER + '/libs/logger')
var zlib = require('zlib')
var tar = require('tar')
var inquirer = require('inquirer')
var enduro_index = require(ENDURO_FOLDER + '/index')
var fs = Promise.promisifyAll(require('fs-extra'))
var npm = require('npm')
var opn = require('opn')

// Goes through the pages and renders them
theme_manager.prototype.create_from_theme = function (theme_name) {
	var self = this

	logger.init('Enduro theme service')

	// will store theme name
	var theme_folder = ''

	// will store setup answers
	var answers = []

	// get info for the specified theme
	return self.fetch_theme_by_name(theme_name)

		// promnt user to input settings for the project
		.then(() => {
			return inquirer.prompt([
				{
					name: 'project_name',
					message: 'choose project name:',
					type: 'input'
				},
				{
					name: 'login_username',
					message: 'choose your admin login:',
					type: 'input'
				},
				{
					name: 'login_password',
					message: 'choose your admin password:',
					type: 'password'
				},
			])
		}, theme_error)

		// create directory with specified name
		.then(function (answers_temp) {

			answers = answers_temp

			logger.line()
			logger.twolog('Created neccessary folders', '✓')
			logger.twolog('downloading your theme template', '✓')
			theme_folder = answers.project_name
			return flat_helpers.ensure_directory_existence(process.cwd() + '/' + theme_folder + '/.')
		}, theme_error)

		// get the theme and put it in created folder
		.then(function () {
			return new Promise(function (resolve, reject) {
				logger.twolog('extracting your theme template', '✓')

				var tar_extract = tar.Extract({
					path: './' + theme_folder,
					strip: 1,
				})

				request('https://github.com/Gottwik/enduro_mirror/archive/master.tar.gz')
					.pipe(zlib.createUnzip())
					.pipe(tar_extract)

				tar_extract.on('finish', () => {
					logger.twolog('project extracted', '✓')
					global.CMD_FOLDER = process.cwd() + '/' + theme_folder
					resolve()
				})
			})

		}, theme_error)

		// sets up admin credentials
		.then(() => {
			logger.twolog('Setting up admin credentials', '✓')
			logger.silent()
			return enduro_index.run(['addadmin', answers.login_username, answers.login_password], [])
		}, theme_error)

		.then(() => {
			logger.twolog('Remove login message', '✓')
			var settings = flat.loadsync('.settings')
			delete settings.settings.login_message

			flat.save('.settings', settings)
		}, theme_error)

		// reads projects dependencies
		.then(() => {
			logger.noisy()
			logger.twolog('getting project dependencies', '✓')
			return fs.readJsonAsync('./' + theme_folder + '/package.json')
		}, theme_error)

		.then((fetched_package) => {
			logger.twolog('installing npm dependencies', '✓')
			return new Promise(function (resolve, reject) {

				// workaround to make npm silent
				var log_temp = console.log
				console.log = function () {}

				npm.load({
					loaded: false,
					progress: false,
					loglevel: 'error',
				}, function (err) {
					var npm_dependencies = _.chain(fetched_package.dependencies)
						.omit('enduro')
						.toPairs()
						.map((dependency) => {
							return dependency[0] + '@' + dependency[1]
						})
						.value()

					npm.commands.install(theme_folder, npm_dependencies, function (err, data) {

						// replace console.log
						console.log = log_temp
						resolve()
					})
				})
			})
		}, theme_error)

		.then(() => {
			logger.twolog('installing bower dependencies', '✓')
			return new Promise(function (resolve, reject) {
				var bower = require(process.cwd() + '/' + theme_folder + '/node_modules/bower/lib/index')
				bower.commands
					.install(undefined, {
						silent: true
					}, {
						cwd: theme_folder
					})
					.on('end', function (installed) {
						logger.twolog('installed bower dependencies', '✓')
						resolve()
					})
			})
		}, theme_error)

		.then(() => {
			logger.line()
			logger.end()

			return enduro_index.run(['start'], [])

		}, theme_error)

		.then(() => {
			logger.timestamp('opening browser')
			opn('http://localhost:5000/')
		}, theme_error)

		.then(null, () => {})
}

// * ———————————————————————————————————————————————————————— * //
// * 	fetch theme by name
// *
// *	requests theme by theme name
// *	@param {string} theme_name
// *	@return {Promise} - promise with theme info as context
// * ———————————————————————————————————————————————————————— * //
theme_manager.prototype.fetch_theme_by_name = function (theme_name) {
	var self = this

	// list all themes and exit if specified theme is not found
	if (!theme_name) {
		logger.log('you have to specify theme name. Try:')
		logger.tablog('$ enduro theme mirror')
		logger.end()
		return Promise.reject()
	}

	logger.loading('Getting info for \'' + theme_name + '\' theme')
	return request(THEME_MANAGER_LINK)
		.then((themes_response) => {
			logger.loaded()

			// store themes
			var themes = JSON.parse(themes_response)

			// list all themes and exit if specified theme is not found
			if (!(theme_name in themes)) {
				self.list_themes(themes)
				return Promise.resolve()
			}

			// stores theme
			theme = themes[theme_name]

			logger.line()
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

function theme_error (n) {
	throw (n)
}

module.exports = new theme_manager()
