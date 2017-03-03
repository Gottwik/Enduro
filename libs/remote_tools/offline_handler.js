// * ———————————————————————————————————————————————————————— * //
// * 	offline_handler
// *	set of tools that enables running enduro website offline
// *	TODO: developed under time constrain, should be refactored and tested
// * ———————————————————————————————————————————————————————— * //
var offline_handler = function () {}

// Vendor dependencies
var Promise = require('bluebird')
var http = require('http')
var fs = require('fs')
var path = require('path')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var pagelist_generator = require(enduro.enduro_path + '/libs/build_tools/pagelist_generator')
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

offline_handler.prototype.convert_cms_file_to_offline = function (cms_file) {

	var list_of_external_resources_to_download = []

	return flat.load(cms_file)
		.then((context) => {

			// console.log(cms_file)
			// this fills list_of_external_resources_to_download
			traverse_offline(context, list_of_external_resources_to_download)

			// returns after all external resources are loaded
			return Promise.all(list_of_external_resources_to_download)
		})
}

offline_handler.prototype.convert_all_to_offline = function () {
	var self = this

	pagelist_generator.generate_cms_list()
		.then((cmslist) => {
			return Promise.all(cmslist.flat.map((page) => { return self.convert_cms_file_to_offline(page.fullpath) }))
		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	parse_for_external_links
// *
// *	@param link {string} - text where links should be found
// *	return array - list of link found in the provided text
// * ———————————————————————————————————————————————————————— * //
function parse_for_external_links (link) {
	if (link.substring(0, 4) == 'http') {
		return [link]
	}

	var matches = link.match(/(https.*?)"/g)

	if (matches != null) {
		matches = matches.map((match) => {
			return match.match(/(https.*?)"/)[1]
		})
		return matches
	}

	return []
}

function download_external_resource (external_link) {
	return new Promise(function (resolve, reject) {
		logger.twolog('Downloading ', external_link)

		// handle https
		external_link = external_link.replace(/^https/, 'http')

		var new_filename = path.join('assets', 'img', 'offline', external_link.match(/\/([^\/]*)$/)[1])
		flat_helpers.ensure_directory_existence(path.join(enduro.project_path, new_filename))
			.then(() => {
				var file = fs.createWriteStream(new_filename)
				http.get(external_link, function (response) {
					response.pipe(file)
					resolve(new_filename)
				})
			})
	})
}

// traverses context, finds external links and pushes it to the provided list
function traverse_offline (context, list_of_external_resources_to_download) {
	for (c in context) {

		if (typeof context[c] === 'string') {
			links = parse_for_external_links(context[c])

			for (l in links) {
				list_of_external_resources_to_download.push(download_external_resource(links[l]).then((local_url) => {
					// context['$' + c + '_offline'] = context[c]
					// context[c] = local_url
				}))
			}
		}

		if (typeof context[c] === 'object') {
			traverse_offline(context[c], list_of_external_resources_to_download)
		}
	}
}

module.exports = new offline_handler()
