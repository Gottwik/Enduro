// * ———————————————————————————————————————————————————————— * //
// * 	theme manager
// *	downloads a theme and extracts it into a new folder
// * ———————————————————————————————————————————————————————— * //
var theme_manager = function () {}

// local dependencies
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')
const logger = require(enduro.enduro_path + '/libs/logger')
const admin_security = require(enduro.enduro_path + '/libs/admin_utilities/admin_security')
const format_service = require(enduro.enduro_path + '/libs/services/format_service')
const enduro_instance = require(enduro.enduro_path + '/index')

// vendor dependencies
const Promise = require('bluebird')
const request = require('request-promise')
const zlib = require('zlib')
const tar = require('tar')
const inquirer = require('inquirer')
const fs = Promise.promisifyAll(require('fs-extra'))
const npm = require('npm')
const opn = require('opn')
const _ = require('lodash')
const path = require('path')

var theme_manager_api_routes = {
	get_theme_by_name: 'http://www.endurojs.com/theme_manager/get_theme_by_name',
	get_all_themes: 'http://www.endurojs.com/theme_manager/get_all_themes',
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

			theme_progress_variables.answers.project_name = format_service.enduro_slug(theme_progress_variables.answers.project_name)

			return flat_helpers.ensure_directory_existence(process.cwd() + '/' + theme_progress_variables.answers.project_name + '/.')
		}, theme_error)

		// get the theme and put it in created folder
		.then(function () {
			return self.download_and_extract_theme_by_gz_link(theme_progress_variables.theme_info.gz_link, theme_progress_variables.answers.project_name)
		}, theme_error)

		.then(() => {
			return self.clean_fresh_theme()
		}, theme_error)

		// sets up admin credentials
		.then(() => {
			logger.twolog('setting up admin credentials', '✓')
			logger.silent()
			return admin_security.add_admin(theme_progress_variables.answers.login_username, theme_progress_variables.answers.login_password)
		}, theme_error)

		// reads project dependencies
		.then(() => {
			logger.noisy()
			logger.twolog('getting project dependencies', '✓')
			return fs.readJsonAsync('./' + theme_progress_variables.answers.project_name + '/package.json')
		}, theme_error)

		.then((fetched_package) => {
			logger.loading('installing npm dependencies')
			return new Promise(function (resolve, reject) {

				// workaround to make npm silent
				var log_temp = console.log
				console.log = function () {}

				npm.load({
					loaded: false,
					progress: false,
					loglevel: 'error',
				}, () => {
					var npm_dependencies = _.chain(fetched_package.dependencies)
						.omit('enduro')
						.toPairs()
						.map((dependency) => {
							return dependency[0] + '@' + dependency[1]
						})
						.value()

					npm.commands.install(theme_progress_variables.answers.project_name, npm_dependencies, function (err, data) {
						if (err) { console.log(error) }

						// replace console.log
						console.log = log_temp
						logger.loaded()
						resolve()
					})
				})
			})
		}, theme_error)

		.then(() => {
			logger.loading('installing bower dependencies')
			return new Promise(function (resolve, reject) {
				var bower = require(process.cwd() + '/' + theme_progress_variables.answers.project_name + '/node_modules/bower/lib/index')
				bower.commands
					.install(undefined, {
						silent: true
					}, {
						cwd: theme_progress_variables.answers.project_name
					})
					.on('end', function (installed) {
						logger.loaded()
						resolve()
					})
			})
		}, theme_error)

		.then(() => {
			logger.loading('starting enduro')
			logger.silent()
			return enduro_instance.init(path.join(process.cwd(), theme_progress_variables.answers.project_name))

		}, theme_error)

		.then(() => {
			return enduro.actions.start()
		}, theme_error)

		.then(() => {
			logger.noisy()
			logger.loaded()

			logger.line()
			logger.log('')
			logger.log('your project was created successfully', true)
			logger.log('to start your project again, just cd')
			logger.log('into project directory and run', true)
			logger.tablog('$ enduro', true)

			logger.loading('the browser should open soon')

			// open localhost in 3 seconds
			// the delay is there to make the process more calm
			setTimeout(() => {
				logger.loaded()
				logger.end()
				opn('http://localhost:5000/')
			}, 3000)
		}, theme_error)

		.then(null, () => {})
}

// * ———————————————————————————————————————————————————————— * //
// * 	get all themes
// *
// *	fetches list of themes
// *	@return {array} - list of all available themes
// * ———————————————————————————————————————————————————————— * //
theme_manager.prototype.get_all_themes = function () {
	return request(theme_manager_api_routes.get_all_themes)
		.then((all_themes_as_string) => {
			return JSON.parse(all_themes_as_string)
		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	fetch theme by name
// *
// *	requests theme by theme name
// *	@param {string} theme_name
// *	@return {Promise} - promise with theme info as context
// * ———————————————————————————————————————————————————————— * //
theme_manager.prototype.fetch_theme_info_by_name = function (theme_name, options) {
	const self = this

	// list all themes and exit if specified theme is not found
	if (!theme_name) {

		return self.get_all_themes()
			.then((all_themes) => {
				return inquirer.prompt([
					{
						name: 'theme_name',
						message: 'choose a theme',
						type: 'list',
						default: 'mirror',
						choices: all_themes.map((theme) => { return theme.name }),
					},
				])
			})
			.then((theme) => {
				return self.fetch_theme_info_by_name(theme.theme_name)
			})
	}

	logger.loading('getting info for \'' + theme_name + '\' theme')
	return request({
		url: theme_manager_api_routes.get_theme_by_name + '/' + theme_name,
		qs: options,
	})
		.then((themes_response) => {

			themes_response = JSON.parse(themes_response)

			logger.loaded()

			if (!themes_response.found) {
				logger.log('theme not found')
				logger.end()
				return Promise.reject()
			}

			return themes_response.theme_info
		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	download and extract theme by gzip link
// *
// *	@param {string} gz_link - remote link hosting the gzip archive
// *	@param {string} project_name - project_name will serve as folder for the new project relative to current path
// *	@return {Promise} - empty promise
// * ———————————————————————————————————————————————————————— * //
theme_manager.prototype.download_and_extract_theme_by_gz_link = function (gz_link, project_name) {
	logger.loading('downloading and extracting theme')

	return new Promise(function (resolve, reject) {

		// tar settings - strip will omit the root folder of the gzip archive
		var tar_extract = tar.Extract({
			path: './' + project_name,
			strip: 1,
		})

		// downloads and extracts
		request(gz_link)
			.pipe(zlib.createUnzip())
			.pipe(tar_extract)

		// resolve when extracting is finished
		tar_extract.on('finish', () => {
			logger.loaded()
			global.enduro.project_path = process.cwd() + '/' + project_name
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

// * ———————————————————————————————————————————————————————— * //
// * 	removes theme specific attibutes such as login message
// *	and demo users from theme
// *
// *	@return {promise} - empty promise
// * ———————————————————————————————————————————————————————— * //
theme_manager.prototype.clean_fresh_theme = function () {
	return flat.upsert('.settings', { settings: { login_message: '' }})
		.then(() => {
			return admin_security.remove_all_users()
		})
}

// helper function that propagates error in the promise chain
function theme_error (n) {
	throw (n)
}

module.exports = new theme_manager()
