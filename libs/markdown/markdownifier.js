// * ———————————————————————————————————————————————————————— * //
// * 	markdownifier
// * ———————————————————————————————————————————————————————— * //
var markdownifier = function () {}

// vendor dependencies
var Promise = require('bluebird')
var glob = require('glob-promise')

// Goes through the pages and renders them
markdownifier.prototype.precompute = function () {
	return new Promise(function (resolve, reject) {

		var markdown_rules_path = enduro.project_path + '/app/markdown_rules/**/*.js'

		// initalizes global precomputed markdown rules to an empty array
		enduro.precomputed_data.markdown_rules = []

		glob(markdown_rules_path)
			.then((files) => {
				for (f in files) {
					enduro.precomputed_data.markdown_rules.push(require(files[f]))
				}
				resolve()
			})

	})
}

// * ———————————————————————————————————————————————————————— * //
// * 	Applies all existent markdown rules to the context specified
// *	@param {pbject} context - context - all markdownifier rules will be applied to all strings in this object
// *	@return {promise} - promise with empty payload
// * ———————————————————————————————————————————————————————— * //
markdownifier.prototype.markdownify = function (context) {
	var self = this

	return Promise.resolve()
		.then(() => {
			// checks if the list of markdown rules was already precomputed
			// and precomputes the markdown rules if they were never precomputed before
			if (enduro.precomputed_data.markdown_rules) {
				return new Promise.resolve()
			} else {
				return self.precompute()
			}
		})
		.then(() => {

			// applies the markdown
			return deep_markdown(context)
		})

}

function deep_markdown (object) {
	for (o in object) {
		if (typeof object[o] === 'object') {
			deep_markdown(object[o])
		}

		if (typeof object[o] === 'string') {
			object[o] = apply_custom_markdown(object[o])

		}
	}

	return object
}

function apply_custom_markdown (input) {
	for (r in enduro.precomputed_data.markdown_rules) {
		input = enduro.precomputed_data.markdown_rules[r](input)
	}
	return input
}

module.exports = new markdownifier()
