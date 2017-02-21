// * ———————————————————————————————————————————————————————— * //
// * 	theme manager
// *	downloads a theme and extracts it into a new folder
// * ———————————————————————————————————————————————————————— * //
var theme_manager = function () {}

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')

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

	logger.init('Created your project')

	// will store theme name
	var theme = ''
	var theme_folder = ''

	// will store setup answers
	var answers = []

	// request all themes
	return request(THEME_MANAGER_LINK)
		.then((themes_response) => {
			logger.twolog('fetching theme info', '✓')

			// store themes
			var themes = JSON.parse(themes_response)

			// list all themes and exit if specified theme is not found
			if (!(theme_name in themes)) {
				self.list_themes(themes)
				return Promise.resolve()
			}

			// stores theme
			logger.twolog('finding ' + theme_name + ' theme', '✓')
			theme = themes[theme_name]

			logger.line()
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
		})

		// create directory with specified name
		.then(function (answers_temp) {

			answers = answers_temp

			logger.line()
			logger.twolog('creating new folder', '✓')
			logger.twolog('downloading your theme template', '✓')
			theme_folder = answers.project_name
			return enduro_helpers.ensure_directory_existence(process.cwd() + '/' + theme_folder + '/.')
		})

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

		})

		// sets up admin credentials
		.then (() => {
			logger.twolog('Setting up admin credentials', '✓')
			logger.silent()
			return enduro_index.run(['addadmin', answers.login_username, answers.login_password], [])
		})

		.then (() => {
			logger.twolog('Remove login message', '✓')
			var settings = flat_file_handler.loadsync('.settings')
			delete settings.settings.login_message

			flat_file_handler.save('.settings', settings)
		})

		// reads projects dependencies
		.then (() => {
			logger.noisy()
			logger.twolog('getting project dependencies', '✓')
			return fs.readJsonAsync('./' + theme_folder + '/package.json')
		})

		.then((package) => {
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
					var npm_dependencies = _.chain(package.dependencies)
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
		})
		.then (() => {
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
					});
			})
		})

		.then(() => {
			logger.line()
			logger.end()

			return enduro_index.run(['start'], [])

		})
		.then(() => {
			logger.timestamp('opening browser')
			opn('http://localhost:5000/')
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
