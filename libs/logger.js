// * ———————————————————————————————————————————————————————— * //
// * 	logger
// *	enables nicer console logging for enduro
// * ———————————————————————————————————————————————————————— * //
var logger = function () {}

// vendor dependencies
var chalk = require('chalk').green

// constants
var FRAME_WIDTH = 60
var TAB_WIDTH = 4

// log abstraction. can be silenced
var log = console.log

// stores starting time of enduro app
var t = new Date().getTime()

// default loggin selection
var logtags_config = {
	nice_dev_init: true,
	enduro_events: true,
	enduro_render_events: false,
	admin_api_calls: false,
	admin_login: false,
	file_uploading: true,
	render_debug: true,
	juicebox: true,
	heroku_debug: false,
	page_manipulation: false,
	server_usage: false,
}

// * ———————————————————————————————————————————————————————— * //
// * 	Info messages
// * ———————————————————————————————————————————————————————— * //

// * ┌——————————————~—ENDURO - CREATING PROJECT—~———————————————┐ * //
logger.prototype.init = function (message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	message = message || 'ENDURO'
	log('\n' + chalk('┌' + cpad(('~—' + message + '—~'), FRAME_WIDTH - 2, '—') + '┐'))
}

// * │ I have something to tell you                             │ * //
logger.prototype.log = function (message, newline, logtag) {
	if (typeof newline === 'string') {
		logtag = newline
		newline = false
	}

	message = message || ''

	if (!pass_tagcheck(logtag)) { return }
	log(chalk('│') + rpad(' ' + message, FRAME_WIDTH - 2) + chalk('│'))
	newline || false ? this.log('') : ''
}

// * │     same as log but with a tab                           │ * //
logger.prototype.tablog = function (message, newline, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	this.log(rep(TAB_WIDTH) + message, newline)
}

// * │ Something                                       Happened │ * //
logger.prototype.twolog = function (message, right_message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	if (!right_message) { return this.log(message, logtag) }
	log(chalk('│') + rpad(' ' + message, FRAME_WIDTH - 3 - right_message.length) + right_message + chalk(' │'))
}

// * ├——————————————————————————————————————————————————————————┤ * //
logger.prototype.line = function (logtag) {
	if (!pass_tagcheck(logtag)) { return }
	log(chalk('├' + rep(FRAME_WIDTH - 2, '—') + '┤'))
}

// * └——————————————————————————————————————————————————————————┘ * //
logger.prototype.end = function (logtag) {
	if (!pass_tagcheck(logtag)) { return }
	log(chalk('└' + rep(FRAME_WIDTH - 2, '—') + '┘'))
}

// * [10:25:30] same as log but with a tab                           * //
logger.prototype.timestamp = function (message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	log('[' + chalk(get_timestamp()) + '] ' + message)
}

logger.prototype.centerlog = function (message, newline, logtag) {
	this.log(cpad(message, FRAME_WIDTH - 4), newline, logtag)
}

// * ———————————————————————————————————————————————————————— * //
// * 	Error messages
// * ———————————————————————————————————————————————————————— * //

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
// * directory already exists                                     * //
// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
logger.prototype.err_block = function (message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	log('\n' + chalk.red(rep(FRAME_WIDTH, '▼')))
	this.err(message)
	log(chalk.red(rep(FRAME_WIDTH, '▲')) + '\n')
}

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ERROR ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
logger.prototype.err_blockStart = function (message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	log('\n')
	log(chalk.red(cpad(' ' + message + ' ', FRAME_WIDTH, '▼')))
}

// * │ Something went wrong                                     │ * //
logger.prototype.err = function (message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	if (!message) { return }
	log(chalk.red(rpad(message, FRAME_WIDTH)))
}

// * │ Something                                       Happened │ * //
logger.prototype.twoerr = function (message, left_message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	log(chalk.red('│') + chalk.red(rpad(' ' + message, FRAME_WIDTH - 3 - left_message.length) + left_message) + chalk.red(' │'))
}

// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
logger.prototype.err_blockEnd = function (logtag) {
	if (!pass_tagcheck(logtag)) { return }
	log(chalk.red(rep(FRAME_WIDTH, '▲')))
	log('\n')
}

logger.prototype.raw_err = function (message, logtag) {
	if (!pass_tagcheck(logtag)) { return }
	this.err_blockStart()
	console.log(message)
	this.err_blockEnd()
}

// * ———————————————————————————————————————————————————————— * //
// * 	Loading functions
// * ———————————————————————————————————————————————————————— * //
var loading_symbols = '⠙⠸⠴⠦⠇⠋'
var currently_loading_handle
var last_message = 'loaded'
logger.prototype.loading = function (message, loading_index) {
	var self = this

	// store current message as last message
	last_message = message

	loading_index = loading_index || 0
	var loading_symbol = loading_symbols[loading_index % loading_symbols.length]
	process.stdout.write(chalk('│') + rpad(' ' + message, FRAME_WIDTH - 3 - 1) + chalk(loading_symbol) + chalk(' │') + '\r')

	currently_loading_handle = setTimeout(() => {
		self.loading(message, loading_index + 1)
	}, 50)
}

logger.prototype.loaded = function (message) {
	var self = this

	// fallback to last message if no message is provided
	message = message || last_message

	clearTimeout(currently_loading_handle)
	process.stdout.write('\r\x1b[K') // clears current line
	self.twolog(message, '✓')
}

// * ———————————————————————————————————————————————————————— * //
// * 	Helper functions
// * ———————————————————————————————————————————————————————— * //

// Silencer
logger.prototype.silent = function (logtag) {
	log = () => {}
}

// Silencer
logger.prototype.noisy = function (logtag) {
	log = console.log
}

// * ———————————————————————————————————————————————————————— * //
// * 	private functions
// * ———————————————————————————————————————————————————————— * //
function pass_tagcheck (logtag) {
	if (typeof logtag === 'undefined' || enduro.flags.debug) {
		return true
	}
	return logtag in logtags_config && logtags_config[logtag]
}

function get_timestamp () {
	var date = new Date()

	var diff = date.getTime() - t

	t = date.getTime()

	return (lpad(date.getHours().toString(), 2) + ':' + lpad(date.getMinutes().toString(), 2) + ':' + lpad(date.getSeconds().toString(), 2) + ' | ' + ('+' + lpad((Math.round((diff) / 10) / 100).toString(), 8, ' ')))
}

// * ———————————————————————————————————————————————————————— * //
// * 	helper functions
// * ———————————————————————————————————————————————————————— * //

function lpad (s, len, c) {
	c = c || '0'

	while (s.length < len) {
		s = c + s
	}

	return s
}

// Pads the string with whitespace to the right
function rpad (text, length) {
	return text + rep(length - clear_ansi_style(text).length, ' ')
}

// Pads and aligns the string with specified character to center
function cpad (text, length, char) {
	var text_length = clear_ansi_style(text).length
	var prev = Math.floor((length - text_length) / 2)
	return rep(prev, char) + text + rep(length - prev - text_length, char)
}

// Returns string of length @len consisting of characters @char
function rep (len, char) {
	return len > 0
		? Array(len + 1).join(char || ' ')
		: ''
}

function clear_ansi_style (text) {
	return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}

module.exports = new logger()
