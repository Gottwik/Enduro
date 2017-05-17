// * ———————————————————————————————————————————————————————— * //
// * 	log clusters
// *
// *	defines logging clusters
// * ———————————————————————————————————————————————————————— * //
var log_clusters = function () {}

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')

var clusters = []

log_clusters.prototype.log = function (cluster, context) {
	clusters[cluster](context)
}

clusters['developer_start'] = (context) => {
	logger.init('Enduro started', 'nice_dev_init')
	logger.log('Development server started at:', 'nice_dev_init')
	logger.tablog('localhost:3000', 'nice_dev_init')

	if (!enduro.flags.noadmin) {
		logger.log('Admin ui available at:', 'nice_dev_init')
		logger.tablog('localhost:5000/admin', false, 'nice_dev_init')
	}

	logger.line('nice_dev_init')
	logger.log('Admin has no live-reload!', false, 'nice_dev_init')
	logger.end('nice_dev_init')
}

clusters['creating_project'] = (context) => {
	logger.init('ENDURO - CREATING PROJECT')
	logger.log('Creating new project ' + context.project_name)
	logger.line()
}

clusters['project_created'] = (context) => {
	logger.log('Project created successfully.')
	logger.line()
	logger.log('Dont forget to cd into project with', true)
	logger.tablog('$ cd ' + context.project_name, true)
	logger.log('Then run', true)
	logger.tablog('$ enduro', true)
	logger.end()
}

clusters['bucket_access_denied'] = (context) => {
	logger.err_blockStart('Bucket permissions not set')
	logger.err('Bucket ' + enduro.config.s3.bucket + ' permissions not set')
	logger.err(' ')
	logger.err('Please go to your aws console and make the bucket public')
	logger.err('http://www.endurojs.com/docs/using-s3-as-filesystem#don-t-forget-to-set-bucket-s-permissions')
	logger.err_blockEnd()
}

clusters['nonexistent_bucket'] = (context) => {
	logger.err_blockStart('Bucket does not exist')
	logger.err('Bucket ' + enduro.config.s3.bucket + ' does not exist')
	logger.err(' ')
	logger.err('Please go to your aws console and create one')
	logger.err(' ')
	logger.err('You probably also want to make it public')
	logger.err_blockEnd()
}

clusters['extraction_failed'] = (context) => {
	logger.err_blockStart('juice extraction failed')
	logger.err('There is something wrong with the last juice archive')
	logger.err(' ')
	logger.err('Run:')
	logger.err('\t$ enduro juice pack -f')
	logger.err(' ')
	logger.err('To repair the issue')
	logger.err_blockEnd()
}

clusters['malformed_context_file'] = (context) => {
	logger.err('malformed_context_file: ' + context)
}

module.exports = new log_clusters()
