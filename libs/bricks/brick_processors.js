// * ———————————————————————————————————————————————————————— * //
// * 	brick processors
// *	exposes internal enduro processes to enduro bricks
// * ———————————————————————————————————————————————————————— * //
const brick_processors = function () {}

const Promise = require('bluebird')
const path = require('path')

// * ———————————————————————————————————————————————————————— * //
// * 	add processor
// * 	@param {string} processor_name
// * 	@param {function} process_action
// * 	return nothing
// * ———————————————————————————————————————————————————————— * //
brick_processors.prototype.add_processor = function (processor_name, process_action) {
	if (!enduro.brick_processors[processor_name]) {
		enduro.brick_processors[processor_name] = [process_action]
	} else {
		enduro.brick_processors[processor_name].push(process_action)
	}
}

brick_processors.prototype.process = function (processor_name, input_data) {
	if (!(processor_name in enduro.brick_processors)) {
		return Promise.resolve(input_data)
	}

	return enduro.brick_processors[processor_name]
		.reduce(function (prev, curr) {
			return prev.then((chained_data) => {
				return curr(chained_data)
			});
		}, Promise.resolve(input_data))
}

module.exports = new brick_processors()
