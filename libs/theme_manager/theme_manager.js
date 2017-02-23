// * ———————————————————————————————————————————————————————— * //
// * 	theme manager
// *	downloads a theme and extracts it into a new folder
// * ———————————————————————————————————————————————————————— * //
var theme_manager = function () {}

// local dependencies
var flat_helpers = require(ENDURO_FOLDER + '/libs/flat_db/flat_helpers')
var flat = require(ENDURO_FOLDER + '/libs/flat_db/flat')
var logger = require(ENDURO_FOLDER + '/libs/logger')
var enduro_index = require(ENDURO_FOLDER + '/index')

// vendor dependencies
var Promise = require('bluebird')
var request = require('request-promise')
var zlib = require('zlib')
var tar = require('tar')
var inquirer = require('inquirer')
var fs = Promise.promisifyAll(require('fs-extra'))
var npm = require('npm')
var opn = require('opn')

var theme_manager_api_routes = {
	get_theme_by_name: 'www.endurojs.com/theme_manager/get_theme_by_name',
	get_all_themes: 'www.endurojs.com/theme_manager/get_all_themes',
}

// Goes through the pages and renders them
theme_manager.prototype.create_from_theme = function (theme_name) {
	var self = this

	logger.init('Enduro theme service')

	// will store variables for the promise chain
	var theme_progress_variables = {}

	// get info for the specified theme
	return self.fetch_theme_info_by_name(theme_name)

		// promnt user to input settings for the project
		.then((theme_info) => {

			// store the theme info
			theme_progress_variables.theme_info = theme_info

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
		.then(function (answers) {

			// stores the answers
			theme_progress_variables.answers = answers

			return flat_helpers.ensure_directory_existence(process.cwd() + '/' + theme_progress_variables.answers.project_name + '/.')
		}, theme_error)

		// get the theme and put it in created folder
		.then(function () {
			return self.download_and_extract_theme_by_gz(theme_progress_variables.theme_info.gz_link, theme_progress_variables.answers.project_name)
		}, theme_error)

		// sets up admin credentials
		.then(() => {
			logger.twolog('Setting up admin credentials', '✓')
			logger.silent()
			return enduro_index.run(['addadmin', theme_progress_variables.answers.login_username, theme_progress_variables.answers.login_password], [])
		}, theme_error)

		// removes login_message
		.then(() => {
			return flat.update('.settings', { settings: { login_message: '' }})
		}, theme_error)

		// reads projects dependencies
		.then(() => {
			logger.noisy()
			logger.twolog('getting project dependencies', '✓')
			return fs.readJsonAsync('./' + theme_progress_variables.answers.project_name + '/package.json')
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

					npm.commands.install(theme_progress_variables.answers.project_name, npm_dependencies, function (err, data) {

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
				var bower = require(process.cwd() + '/' + theme_progress_variables.answers.project_name + '/node_modules/bower/lib/index')
				bower.commands
					.install(undefined, {
						silent: true
					}, {
						cwd: theme_progress_variables.answers.project_name
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
theme_manager.prototype.fetch_theme_info_by_name = function (theme_name) {
	var self = this

	// list all themes and exit if specified theme is not found
	if (!theme_name) {
		logger.log('you have to specify theme name. Try:')
		logger.tablog('$ enduro theme mirror')
		logger.end()
		return Promise.reject()
	}

	logger.loading('Getting info for \'' + theme_name + '\' theme')
	return request(theme_manager_api_routes.get_theme_by_name + '/theme_name')
		.then((themes_response) => {
			logger.loaded()

			console.log(themes_response, typeof themes_response)

			logger.line()
		})
}

theme_manager.prototype.download_and_extract_theme_by_gz = function (gz_link, project_name) {
	return new Promise(function (resolve, reject) {

		var tar_extract = tar.Extract({
			path: './' + project_name,
			strip: 1,
		})

		request(gz_link)
			.pipe(zlib.createUnzip())
			.pipe(tar_extract)

		tar_extract.on('finish', () => {
			logger.twolog('project extracted', '✓')
			global.CMD_FOLDER = process.cwd() + '/' + project_name
			resolve()
		})
	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	list themes
// *
// *	prints out supplied themes
// *	@param {object} themes
// *	@return {nothing}
// * ———————————————————————————————————————————————————————— * //
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

// helper function that propagates error in the promise chain
function theme_error (n) {
	throw (n)
}

module.exports = new theme_manager()
