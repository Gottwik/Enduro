// * ———————————————————————————————————————————————————————— * //
// * 	Kiska Logger
// *	Enables nicer console logging for enduro
// * ———————————————————————————————————————————————————————— * //

var kiska_logger = function () {}
var chalk = require('chalk')

// Config
var FRAME_WIDTH = 60

var log = console.log;

// * 	Info messages

// * ┌——————————————~—ENDURO - CREATING PROJECT—~———————————————┐ * //
kiska_logger.prototype.init = function (message) {
	message = message || 'ENDURO'
	log('\n' + chalk.cyan('┌' + ('~—'+message+'—~').cpad(FRAME_WIDTH-2, '—') + '┐'))
};

// * │ I have something to tell you                             │ * //
kiska_logger.prototype.log = function (message, newline) {
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH-2) + chalk.cyan('│'))
	newline || false ? this.log('') : ''
};

// * │ Something                                       Happened │ * //
kiska_logger.prototype.twolog = function (message, left_message) {
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message + chalk.cyan(' │'))
};

// * ├——————————————————————————————————————————————————————————┤ * //
kiska_logger.prototype.line = function (message) {
	log(chalk.cyan('├' + rep(FRAME_WIDTH-2, '—') + '┤'))
};

// * └——————————————————————————————————————————————————————————┘ * //
kiska_logger.prototype.end = function() {
	log(chalk.cyan('└' + rep(FRAME_WIDTH-2, '—') + '┘'))
}


// * 	Error messages

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
// * directory already exists                                     * //
// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
kiska_logger.prototype.errBlock = function (message) {
	log('\n' + chalk.red(rep(FRAME_WIDTH, '▼')))
	this.err(message)
	log(chalk.red(rep(FRAME_WIDTH, '▲')) + '\n')
};

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ERROR ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
kiska_logger.prototype.errBlockStart = function (message) {
	log('\n')
	log(chalk.red((' ' + message + ' ').cpad(FRAME_WIDTH, '▼')))
};

// * │ Something went wrong                                     │ * //
kiska_logger.prototype.err = function (message) {
	log(chalk.red(message.rpad(FRAME_WIDTH)))
};

// * │ Something                                       Happened │ * //
kiska_logger.prototype.twoerr = function (message, left_message) {
	log(chalk.red('│') + chalk.red((' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message) + chalk.red(' │'))
};

// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
kiska_logger.prototype.errBlockEnd = function () {
	log(chalk.red(rep(FRAME_WIDTH, '▲')))
	log('\n')
};

// Silencer
kiska_logger.prototype.silent = function () {
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

module.exports = new kiska_logger()