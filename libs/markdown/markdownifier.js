// * ———————————————————————————————————————————————————————— * //
// * 	markdownifier
// * ———————————————————————————————————————————————————————— * //
var markdownifier = function () {}

var markdown_rules = []

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var glob = require('glob-promise')
var path = require('path')

// Goes through the pages and renders them
markdownifier.prototype.init = function() {
	return new Promise(function(resolve, reject){

		var self = this

		var markdown_rules_path = CMD_FOLDER + '/app/markdown_rules/*.js'

		glob(markdown_rules_path)
			.then((files) => {
				for(f in files) {
					markdown_rules.push(require(files[f]))
				}
				resolve()
			})

	})
}

// Goes through the pages and renders them
markdownifier.prototype.markdownify = function(input) {
	deep_markdown(input)
}

function deep_markdown(object) {
	for(o in object) {
		if(typeof object[o] === 'object') {
			deep_markdown(object[o])
		}

		if(typeof object[o] === 'string') {
			// custom, app-specific markdow
			object[o] = apply_custom_markdown(object[o])

		}
	}
}

function apply_custom_markdown(input) {
	for(r in markdown_rules) {
		input = markdown_rules[r](input)
	}
	return input
}

module.exports = new markdownifier()