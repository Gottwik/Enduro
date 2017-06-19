// * ———————————————————————————————————————————————————————— * //
// * 	ab tester
// *	handles a/b testing
// * ———————————————————————————————————————————————————————— * //
var ab_tester = function () {}

// vendor dependencies
var _ = require('lodash')

// local dependencies
var page_queue_generator = require(enduro.enduro_path + '/libs/page_rendering/page_queue_generator')

// * ———————————————————————————————————————————————————————— * //
// * 	get ab list
// * 	generates list of ab testing races
// *
// *	list looks like this:
// *	{
// *		index: [
// *			{
// *				page: 'index'
// *			}, {
// *				page: 'index@ab'
// *			}, {
// *				page: 'index@bb'
// *			}
// *		],
// *		test: [
// *			{
// *				page: 'test'
// *	 		}, {
// *		 		page: 'test@bigbutton'
// *	 		}
// *		]
// *	}
// *
// *	@return {object} - array of testing races
// * ———————————————————————————————————————————————————————— * //
ab_tester.prototype.get_ab_list = function () {
	return page_queue_generator.get_all_pages()
		.then((pages) => {

			// gets page list
			pages = pages.map((page) => {
				return page_queue_generator.get_page_url_from_full_path(page).split('@')
			})

			// groups by page
			pages = _.groupBy(pages, (page) => { return page[0] })

			// removes first item
			for (p in pages) {
				pages[p].shift()
				pages[p].map((page) => {
					page.shift()
				})

				if (!pages[p].length) {
					delete pages[p]
					continue
				}

				pages[p].unshift([])

				// add urls and paths
				pages[p] = pages[p].map((page) => {

					var file = page.length ? p + '@' + page : p

					return {
						page: file
					}
				})
			}

			return pages
		})
}

ab_tester.prototype.get_ab_tested_filepath = function (url, req, res) {
	var self = this

	// removes slash from the front
	page_name = url[0] == '/' ? url.substring(1) : url

	return new Promise(function (resolve, reject) {
		self.generate_global_ab_list_if_nonexistent()
			.then(() => {

				// return if page does not have an ab_tests
				if (!(page_name in global.ab_test_scenarios)) {
					return resolve(url)
				}

				var ab_scenario = global.ab_test_scenarios[page_name]

				var picked_variation

				// check if user has cookie for this url
				if (req.cookies['enduro_ab_' + url]) {
					picked_variation = req.cookies['enduro_ab_' + url]
				} else {
					picked_variation = ab_scenario[Math.floor(Math.random() * ab_scenario.length)]
					res.cookie('enduro_ab_' + url, picked_variation, { maxAge: 900000, httpOnly: true })
				}

				if (picked_variation.page == 'index') {
					resolve('/index')
				} else {
					resolve('/' + picked_variation.page + '/index')
				}
			})
	})
}

ab_tester.prototype.generate_global_ab_list_if_nonexistent = function () {
	var self = this

	return new Promise(function (resolve, reject) {
		if (typeof global.ab_test_scenarios === 'undefined') {
			self.generate_global_ab_list()
				.then(() => {
					resolve()
				})
		} else {

			resolve()
		}
	})
}

ab_tester.prototype.generate_global_ab_list = function () {
	var self = this

	return self.get_ab_list()
		.then((ab_list) => {
			global.ab_test_scenarios = ab_list
		})
}

module.exports = new ab_tester()
