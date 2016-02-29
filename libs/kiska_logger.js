
// * ———————————————————————————————————————————————————————— * //
// * 	Kiska Logger
// *	Enables nicer console logging for enduro
// * ———————————————————————————————————————————————————————— * //

var KiskaLogger = function () {}
var chalk = require('chalk')

// Config
var CONSOLE_LENGTH = 60

var log = console.log;


// * 	Info messages

// * ┌——————————————~—ENDURO - CREATING PROJECT—~———————————————┐ * //
KiskaLogger.prototype.init = function (message) {
	message = message || 'ENDURO'
	log('\n' + chalk.cyan('┌' + ('~—'+message+'—~').cpad(CONSOLE_LENGTH-2, '—') + '┐'))
};

// * │ I have something to tell you                             │ * //
KiskaLogger.prototype.log = function (message, newline) {
	log(chalk.cyan('│') + (' ' + message).rpad(CONSOLE_LENGTH-2) + chalk.cyan('│'))
	newline || false ? this.log('') : ''
};

// * │ Something                                       Happened │ * //
KiskaLogger.prototype.twolog = function (message, left_message) {
	log(chalk.cyan('│') + (' ' + message).rpad(CONSOLE_LENGTH - 3 - left_message.length) + left_message + chalk.cyan(' │'))
};

// * ├——————————————————————————————————————————————————————————┤ * //
KiskaLogger.prototype.line = function (message) {
	log(chalk.cyan('├' + rep(CONSOLE_LENGTH-2, '—') + '┤'))
};

// * └——————————————————————————————————————————————————————————┘ * //
KiskaLogger.prototype.end = function() {
	log(chalk.cyan('└' + rep(CONSOLE_LENGTH-2, '—') + '┘'))
}


// * 	Error messages

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
// * directory already exists                                     * //
// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
KiskaLogger.prototype.errBlock = function (message) {
	log('\n' + chalk.red(rep(CONSOLE_LENGTH, '▼')))
	this.err(message)
	log(chalk.red(rep(CONSOLE_LENGTH, '▲')) + '\n')
};

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ERROR ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
KiskaLogger.prototype.errBlockStart = function (message) {
	log('\n')
	log(chalk.red((' ' + message + ' ').cpad(CONSOLE_LENGTH, '▼')))
};

// * │ Something went wrong                                     │ * //
KiskaLogger.prototype.err = function (message) {
	log(chalk.red(message.rpad(CONSOLE_LENGTH)))
};

// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
KiskaLogger.prototype.errBlockEnd = function () {
	log(chalk.red(rep(CONSOLE_LENGTH, '▲')))
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