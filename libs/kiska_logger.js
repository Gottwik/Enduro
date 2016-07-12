// * ———————————————————————————————————————————————————————— * //
// * 	Kiska Logger
// *	Enables nicer console logging for enduro
// * ———————————————————————————————————————————————————————— * //
var kiska_logger = function () {}

// vendor dependencies
var chalk = require('chalk')

// constants
var FRAME_WIDTH = 60
var TAB_WIDTH = 4
var TIME_REFRESH_LIMIT = 60

// log abstraction. can be silenced
var log = console.log;

// stores starting time of enduro app
var t = new Date().getTime();

// default loggin selection
var logtags_config = {
	nice_dev_init: true,
	enduro_events: true,
	enduro_render_events: false,
	admin_api_calls: false,
	admin_login: false,
	file_uploading: true,
	render_debug: true,
	juicebox: true
}

// * ———————————————————————————————————————————————————————— * //
// * 	Info messages
// * ———————————————————————————————————————————————————————— * //

// * ┌——————————————~—ENDURO - CREATING PROJECT—~———————————————┐ * //
kiska_logger.prototype.init = function (message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	message = message || 'ENDURO'
	log('\n' + chalk.cyan('┌' + ('~—'+message+'—~').cpad(FRAME_WIDTH-2, '—') + '┐'))
};

// * │ I have something to tell you                             │ * //
kiska_logger.prototype.log = function (message, newline, logtag) {
	if(typeof newline === 'string') {
		logtag = newline
		newline = false
	}
	if(!pass_tagcheck(logtag)){ return }
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH-2) + chalk.cyan('│'))
	newline || false ? this.log('') : ''
};

// * │     same as log but with a tab                           │ * //
kiska_logger.prototype.tablog = function (message, newline, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	this.log(rep(TAB_WIDTH) + message,newline)
};

// * │ Something                                       Happened │ * //
kiska_logger.prototype.twolog = function (message, left_message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log(chalk.cyan('│') + (' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message + chalk.cyan(' │'))
};

// * ├——————————————————————————————————————————————————————————┤ * //
kiska_logger.prototype.line = function (logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log(chalk.cyan('├' + rep(FRAME_WIDTH-2, '—') + '┤'))
};

// * └——————————————————————————————————————————————————————————┘ * //
kiska_logger.prototype.end = function(logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log(chalk.cyan('└' + rep(FRAME_WIDTH-2, '—') + '┘'))
}

// * [10:25:30] same as log but with a tab                           * //
kiska_logger.prototype.timestamp = function (message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log('[' + chalk.cyan(get_timestamp()) + '] ' + message)
};


// * ———————————————————————————————————————————————————————— * //
// * 	Error messages
// * ———————————————————————————————————————————————————————— * //

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
// * directory already exists                                     * //
// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
kiska_logger.prototype.err_block = function (message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log('\n' + chalk.red(rep(FRAME_WIDTH, '▼')))
	this.err(message)
	log(chalk.red(rep(FRAME_WIDTH, '▲')) + '\n')
};

// * ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ERROR ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ * //
kiska_logger.prototype.err_blockStart = function (message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log('\n')
	log(chalk.red((' ' + message + ' ').cpad(FRAME_WIDTH, '▼')))
};

// * │ Something went wrong                                     │ * //
kiska_logger.prototype.err = function (message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	if(!message) { return }
	log(chalk.red(message.rpad(FRAME_WIDTH)))
};

// * │ Something                                       Happened │ * //
kiska_logger.prototype.twoerr = function (message, left_message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log(chalk.red('│') + chalk.red((' ' + message).rpad(FRAME_WIDTH - 3 - left_message.length) + left_message) + chalk.red(' │'))
};

// * ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ * //
kiska_logger.prototype.err_blockEnd = function (logtag) {
	if(!pass_tagcheck(logtag)){ return }
	log(chalk.red(rep(FRAME_WIDTH, '▲')))
	log('\n')
};

kiska_logger.prototype.raw_err = function (message, logtag) {
	if(!pass_tagcheck(logtag)){ return }
	this.err_blockStart()
	console.log(message)
	this.err_blockEnd()
};



// Silencer
kiska_logger.prototype.silent = function (logtag) {
	log = () => {};
}


// * ———————————————————————————————————————————————————————— * //
// * 	private functions
// * ———————————————————————————————————————————————————————— * //
function pass_tagcheck(logtag) {
	if(typeof logtag === 'undefined') {
		return true
	}
	return logtag in logtags_config && logtags_config[logtag]
}

function get_timestamp() {
	var date = new Date();

	var diff = date.getTime() - t

	t = date.getTime()

	return (date.getHours().toString().lpad(2) + ":" + date.getMinutes().toString().lpad(2) + ":" + date.getSeconds().toString().lpad(2) + ' | ' + ('+' + Math.round((diff) / 10) / 100).toString().lpad(8, ' '))
}


// * ———————————————————————————————————————————————————————— * //
// * 	helper functions
// * ———————————————————————————————————————————————————————— * //

// pads from left
String.prototype.lpad= function(len, c){
	var s = this
	var c = c || '0'

	while( s.length < len) {
		s = c + s
	}

	return s;
}

// Pads the string with whitespace to the right
String.prototype.rpad = function(length) {
	return this + rep(length - this.length, ' ')
}

// Pads and aligns the string with specified character to center
String.prototype.cpad = function(length, char) {
	var prev = Math.floor(( length - this.length ) / 2)
	return rep(prev, char) + this + rep(length - prev - this.length, char)
}

// Returns string of length @len consisting of characters @char
function rep(len, char){
	return len > 0
		? Array(len + 1).join(char || ' ')
		: ''
}

module.exports = new kiska_logger()