// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.render
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

var Promise = require('bluebird')

var logger = require(enduro.enduro_path + '/libs/logger')
var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
var global_data = require(enduro.enduro_path + '/libs/global_data')
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')
var components_handler = require(enduro.enduro_path + '/libs/components_handler')
var enduro_render = require(enduro.enduro_path + '/libs/enduro_render')
var gulp_tasks = require(enduro.enduro_path + '/libs/build_tools/gulp_tasks')
var pregenerator = require(enduro.enduro_path + '/libs/pregenerator/pregenerator')
var abstractor = require(enduro.enduro_path + '/libs/abstractor/abstractor')
var ab_tester = require(enduro.enduro_path + '/libs/ab_testing/ab_tester')
var markdownifier = require(enduro.enduro_path + '/libs/markdown/markdownifier')
var event_hooks = require(enduro.enduro_path + '/libs/external_links/event_hooks')

action.prototype.action = function (dont_do_juice_pull) {

	logger.init('Enduro', 'enduro_render_events')
	return Promise.resolve()
		.then(() => {
			if (!dont_do_juice_pull && !enduro.flags.nojuice) {
				return juicebox.pull(false)
			} else {
				return new Promise.resolve()
			}
		})
		.then(() => {
			return global_data.get_global_data()
		})
		.then(() => {
			return components_handler.read_components()
		})
		.then(() => {
			return helper_handler.read_helpers()
		})
		.then(() => {
			return abstractor.init()
		})
		.then(() => {
			return markdownifier.precompute()
		})
		.then(() => {
			return ab_tester.generate_global_ab_list()
		})
		.then(() => {
			return pregenerator.pregenerate()
		})
		.then(() => {
			return new Promise(function (resolve, reject) {
				return gulp_tasks.start('preproduction', () => {
					resolve()
				})
			})
		})
		.then(() => {
			return enduro_render.render()
		})
		.then(() => {
			return new Promise(function (resolve, reject) {
				return gulp_tasks.start('production', () => {
					resolve()
				})
			})
		})
		.then(() => {
			return event_hooks.execute_hook('post_update')
		})
		.then(() => {
			logger.end('enduro_render_events')
		})
}

module.exports = new action()
