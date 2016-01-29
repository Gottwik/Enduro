var chalk = require('chalk')

var KiskaLogger = function () {};

KiskaLogger.prototype.log = function (message) {
	console.log(chalk.cyan('│') + (' ' + message).rpad(46) + chalk.cyan('│'))
};

KiskaLogger.prototype.err = function (message) {
	console.log(chalk.cyan('│') + chalk.red((' ' + message).rpad(46)) + chalk.cyan('│'))
};

KiskaLogger.prototype.twolog = function (message, left_message) {
	console.log(chalk.cyan('│') + (' ' + message).rpad(45-left_message.length) + left_message + chalk.cyan(' │'))
};

KiskaLogger.prototype.init = function (message) {
	console.log('\n\n\n\n')
	console.log(chalk.cyan('┌————————————————————KISKA7————————————————————┐'))
};

KiskaLogger.prototype.line = function (message) {
	console.log(chalk.cyan('├——————————————————————————————————————————————┤'))
};

KiskaLogger.prototype.end = function() {
	console.log(chalk.cyan('└——————————————————————————————————————————————┘'))
}

String.prototype.rpad = function(length) {
    var str = this;
    while (str.length < length)
        str = str + ' ';
    return str;
}

module.exports = new KiskaLogger()