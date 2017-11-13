// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.render
// * ———————————————————————————————————————————————————————— * //

const action = function () {}

const Promise = require('bluebird')

const logger = require(enduro.enduro_path + '/libs/logger')
const juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
const global_data = require(enduro.enduro_path + '/libs/global_data')
const helper_handler = require(enduro.enduro_path + '/libs/helper_handler')
const components_handler = require(enduro.enduro_path + '/libs/components_handler')
const enduro_render = require(enduro.enduro_path + '/libs/enduro_render')
const gulp_tasks = require(enduro.enduro_path + '/libs/build_tools/gulp_tasks')
const pregenerator = require(enduro.enduro_path + '/libs/pregenerator/pregenerator')
const abstractor = require(enduro.enduro_path + '/libs/abstractor/abstractor')
const ab_tester = require(enduro.enduro_path + '/libs/ab_testing/ab_tester')
const markdownifier = require(enduro.enduro_path + '/libs/markdown/markdownifier')
const event_hooks = require(enduro.enduro_path + '/libs/external_links/event_hooks')
const brick_handler = require(enduro.enduro_path + '/libs/bricks/brick_handler')

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
			return brick_handler.load_bricks()
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
