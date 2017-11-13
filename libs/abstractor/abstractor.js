// * ———————————————————————————————————————————————————————— * //
// * 	abstractor
// *
// *	adds data to context by fetching external content
// * ———————————————————————————————————————————————————————— * //
const abstractor = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const glob = require('glob-promise')
const path = require('path')

// * enduro dependencies
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')

abstractor.prototype.abstractors = {}

abstractor.prototype.init = function () {

	const self = this

	const abstractors_path = enduro.project_path + '/app/abstractors/*.js'

	enduro.precomputed_data.abstractors = {}

	// fetches the files
	return glob(abstractors_path)
		.then((files) => {
			let abstraction_inits = []

			for (f in files) {

				const abstractor_name = path.basename(files[f], '.js')

				enduro.precomputed_data.abstractors[abstractor_name] = require(files[f])
				// check if abstractor has an init function
				if (enduro.precomputed_data.abstractors[abstractor_name].init) {
					abstraction_inits.push(enduro.precomputed_data.abstractors[abstractor_name].init())
				}
			}
			return Promise.all(abstraction_inits)
		})
		.then(() => {

			const all_cms_files = enduro.project_path + '/cms/**/*.js'

			return glob(all_cms_files)
		})
		.then((files) => {

			const file_abstractions = []

			for (f in files) {
				file_abstractions.push(self.abstract_file(files[f]))
			}

			return Promise.all(file_abstractions)
		})
}

abstractor.prototype.abstract_file = function (filename) {

	const self = this
	const cms_filename = flat.get_cms_filename_from_fullpath(filename)

	let prechange_context = ''

	return flat.load(cms_filename)
		.then((context) => {
			prechange_context = JSON.stringify(context)
			return self.abstract_context(context)
		})
		.then((abstracted_context) => {

			// check if the abstractor changed the context
			if (prechange_context == JSON.stringify(abstracted_context)) {
				return new Promise.resolve()
			} else {
				return flat.save(cms_filename, abstracted_context)
			}
		})
}

abstractor.prototype.abstract_context = function (context) {
	return new Promise(function (resolve, reject) {
		deep_abstract(context)
			.then(() => {
				resolve(context)
			})
	})
}

function deep_abstract (context) {

	let abstraction_list = []

	for (c in context) {
		if (c in enduro.precomputed_data.abstractors && typeof context[c] !== 'function') {
			abstraction_list.push(enduro.precomputed_data.abstractors[c].abstract(context))
		}

		if (typeof context[c] == 'object') {
			abstraction_list.push(deep_abstract(context[c]))
		}
	}

	return Promise.all(abstraction_list)
}

module.exports = new abstractor()
