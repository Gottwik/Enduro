// * ———————————————————————————————————————————————————————— * //
// * 	Kiska Logger
// *	Enables nicer console logging for enduro
// * ———————————————————————————————————————————————————————— * //

var KiskaLogger = function () {}
var chalk = require('chalk')

// Config
var FRAME_WIDTH = 60

var log = console.log;

// * 	Info messages

// * ┌——————————————~—ENDURO - CREATING PROJECT—~———————————————┐ * //
KiskaLogger.prototype.init = function (message) {
	message = message || 'ENDURO'
	log('\n' + chalk.cyan('┌' + ('~—'+message+'—~').cpad(FRAME_WIDTH-2, '—') + '┐'))
};

// * │ I have something to tell you                             │ * //
KiskaLogger.prototype.log = function (message, newline) {
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH-2) + chalk.cyan('│'))
	newline || false ? this.log('') : ''
};

// * │ Something                                       Happened │ * //
KiskaLogger.prototype.twolog = function (message, left_message) {
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message + chalk.cyan(' │'))
};

// * ├——————————————————————————————————————————————————————————┤ * //
KiskaLogger.prototype.line = function (message) {
	log(chalk.cyan('├' + rep(FRAME_WIDTH-2, '—') + '┤'))
};

// * └——————————————————————————————————————————————————————————┘ * //
KiskaLogger.prototype.end = function() {
	log(chalk.cyan('└' + rep(FRAME_WIDTH-2, '—') + '┘'))
}


// * 	Error messages

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
// * directory already exists                                     * //
// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
KiskaLogger.prototype.errBlock = function (message) {
	log('\n' + chalk.red(rep(FRAME_WIDTH, '▼')))
	this.err(message)
	log(chalk.red(rep(FRAME_WIDTH, '▲')) + '\n')
};

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ERROR ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
KiskaLogger.prototype.errBlockStart = function (message) {
	log('\n')
	log(chalk.red((' ' + message + ' ').cpad(FRAME_WIDTH, '▼')))
};

// * │ Something went wrong                                     │ * //
KiskaLogger.prototype.err = function (message) {
	log(chalk.red(message.rpad(FRAME_WIDTH)))
};

// * │ Something                                       Happened │ * //
KiskaLogger.prototype.twoerr = function (message, left_message) {
	log(chalk.red('│') + chalk.red((' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message) + chalk.red(' │'))
};

// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
KiskaLogger.prototype.errBlockEnd = function () {
	log(chalk.red(rep(FRAME_WIDTH, '▲')))
	log('\n')
};

// Silencer
KiskaLogger.prototype.silent = function () {
	log = () => {};
}


// * 	Helper functions

// Pads the string with whitespace to the right
String.prototype.rpad = function(length) {
	return this + rep(length-this.length, ' ')
}

// Pads and aligns the string with specified character to center
String.prototype.cpad = function(length, char) {
	var prev = Math.floor(( length - this.length ) / 2)
	return rep(prev, char) + this + rep(length - prev - this.length, char)
}

// Returns string of length @len consisting of characters @char
function rep(len, char){
	return Array(len+1).join(char)
}

module.exports = new KiskaLogger()