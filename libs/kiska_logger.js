
// * ———————————————————————————————————————————————————————— * //
// * 	Kiska Logger
// *	Enables nicer console logging for enduro
// * ———————————————————————————————————————————————————————— * //

var KiskaLogger = function () {};
var chalk = require('chalk')

// Config
var CONSOLE_LENGTH = 60

KiskaLogger.prototype.log = function (message) {
	console.log(chalk.cyan('│') + (' ' + message).rpad(CONSOLE_LENGTH-1) + chalk.cyan('│'))
};

KiskaLogger.prototype.err = function (message) {
	console.log(chalk.cyan('│') + chalk.red((' ' + message).rpad(CONSOLE_LENGTH-4)) + chalk.cyan('│'))
};

KiskaLogger.prototype.Block = function (message) {
	console.log('\n')
	console.log(chalk.red(rep(CONSOLE_LENGTH, '▼')))
	this.err(message)
	console.log(chalk.red(rep(CONSOLE_LENGTH, '▲')))
};

KiskaLogger.prototype.errBlockStart = function (message) {
	console.log('\n')
	console.log(chalk.red((' ' + message + ' ').cpad(CONSOLE_LENGTH, '▼')))
};

KiskaLogger.prototype.errBlockEnd = function () {
	console.log(chalk.red(rep(CONSOLE_LENGTH, '▲')))
	console.log('\n')
};

KiskaLogger.prototype.twolog = function (message, left_message) {
	console.log(chalk.cyan('│') + (' ' + message).rpad(CONSOLE_LENGTH - 3 - left_message.length) + left_message + chalk.cyan(' │'))
};

KiskaLogger.prototype.init = function (message) {
	console.log('\n\n')
	console.log(chalk.cyan('┌' + '~—ENDURO—~'.cpad(CONSOLE_LENGTH-2, '—') + '┐'))
};

KiskaLogger.prototype.line = function (message) {
	console.log(chalk.cyan('├' + rep(CONSOLE_LENGTH-2, '—') + '┤'))
};

KiskaLogger.prototype.end = function() {
	console.log(chalk.cyan('└' + rep(CONSOLE_LENGTH-2, '—') + '┘'))
}

// Pads the string with whitespace to the right
String.prototype.rpad = function(length) {
	var str = this;
	while (str.length < length)
		str = str + ' ';
	return str;
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