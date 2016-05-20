// * ———————————————————————————————————————————————————————— * //
// * 	Kiska Logger
// *	Enables nicer console logging for enduro
// * ———————————————————————————————————————————————————————— * //

var kiska_logger = function () {}
var chalk = require('chalk')

// Config
var FRAME_WIDTH = 60
var TAB_WIDTH = 4
var TIME_REFRESH_LIMIT = 60

var log = console.log;

var loglevel = 3

var t = new Date().getTime();

// * 	Info messages

// * ┌——————————————~—ENDURO - CREATING PROJECT—~———————————————┐ * //
kiska_logger.prototype.init = function (message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	message = message || 'ENDURO'
	log('\n' + chalk.cyan('┌' + ('~—'+message+'—~').cpad(FRAME_WIDTH-2, '—') + '┐'))
};

// * │ I have something to tell you                             │ * //
kiska_logger.prototype.log = function (message, newline, message_loglevel) {
	if(typeof newline === 'number') {
		message_loglevel = newline
		newline = false
	}
	if(checkloglevel(message_loglevel)){ return }
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH-2) + chalk.cyan('│'))
	newline || false ? this.log('') : ''
};

// * │     same as log but with a tab                           │ * //
kiska_logger.prototype.tablog = function (message, newline, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	this.log(rep(TAB_WIDTH) + message,newline)
};

// * │ Something                                       Happened │ * //
kiska_logger.prototype.twolog = function (message, left_message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message + chalk.cyan(' │'))
};

// * ├——————————————————————————————————————————————————————————┤ * //
kiska_logger.prototype.line = function (message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log(chalk.cyan('├' + rep(FRAME_WIDTH-2, '—') + '┤'))
};

// * └——————————————————————————————————————————————————————————┘ * //
kiska_logger.prototype.end = function(message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log(chalk.cyan('└' + rep(FRAME_WIDTH-2, '—') + '┘'))
}

// * [10:25:30] same as log but with a tab                           * //
kiska_logger.prototype.timestamp = function (message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log('[' + chalk.cyan(get_timestamp()) + '] ' + message)
};


// * 	Error messages

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
// * directory already exists                                     * //
// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
kiska_logger.prototype.errBlock = function (message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log('\n' + chalk.red(rep(FRAME_WIDTH, '▼')))
	this.err(message)
	log(chalk.red(rep(FRAME_WIDTH, '▲')) + '\n')
};

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ERROR ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
kiska_logger.prototype.errBlockStart = function (message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log('\n')
	log(chalk.red((' ' + message + ' ').cpad(FRAME_WIDTH, '▼')))
};

// * │ Something went wrong                                     │ * //
kiska_logger.prototype.err = function (message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log(chalk.red(message.rpad(FRAME_WIDTH)))
};

// * │ Something                                       Happened │ * //
kiska_logger.prototype.twoerr = function (message, left_message, message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log(chalk.red('│') + chalk.red((' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message) + chalk.red(' │'))
};

// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
kiska_logger.prototype.errBlockEnd = function (message_loglevel) {
	if(checkloglevel(message_loglevel)){ return }
	log(chalk.red(rep(FRAME_WIDTH, '▲')))
	log('\n')
};

// Silencer
kiska_logger.prototype.silent = function (message_loglevel) {
	log = () => {};
}

// Sets loglevel
kiska_logger.prototype.setloglevel = (loglevel) => {
	loglevel = loglevel
}

// private functions
function checkloglevel(message_loglevel) {
	if(typeof message_loglevel === 'undefined') {
		return true
	}

	return message_loglevel != loglevel
}

function get_timestamp() {
	var date = new Date();

	var diff = date.getTime() - t

	t = date.getTime()

	return (date.getHours().toString().lpad(2) + ":" + date.getMinutes().toString().lpad(2) + ":" + date.getSeconds().toString().lpad(2) + ' | ' + ('+' + Math.round((diff) / 10) / 100).toString().lpad(8, ' '))
}


// * 	Helper functions

String.prototype.lpad= function(len, c){
    var s= this, c= c || '0';
    while(s.length< len) s= c+ s;
    return s;
}

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
	char = char || ' '
	return Array(len + 1).join(char)
}

module.exports = new kiska_logger()