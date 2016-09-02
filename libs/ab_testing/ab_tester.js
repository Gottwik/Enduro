// * ———————————————————————————————————————————————————————— * //
// * 	ab tester
// *	handles a/b testing
// * ———————————————————————————————————————————————————————— * //
var ab_tester = function () {}

// vendor dependencies
var _ = require('lodash')

// local dependencies
var page_queue_generator = require(ENDURO_FOLDER + '/libs/page_rendering/page_queue_generator')

// * ———————————————————————————————————————————————————————— * //
// * 	get ab list
// * 	generates list of ab testing races
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
						page: file,
						file: file + '.html'
					}
				})
			}

			return pages
		})
}

module.exports = new ab_tester()
