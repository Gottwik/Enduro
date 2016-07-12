// * ———————————————————————————————————————————————————————— * //
// * 	log clusters
// *
// *	defines logging clusters
// * ———————————————————————————————————————————————————————— * //
var log_clusters = function () {};

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

var clusters = []

log_clusters.prototype.log = function (cluster, context) {
	clusters[cluster](context)
}

clusters['developer_start'] = (context) => {
	kiska_logger.init('Enduro started', 'nice_dev_init')
	kiska_logger.log('Development server started at:', 'nice_dev_init')
	kiska_logger.tablog('localhost:3000', 'nice_dev_init')
	kiska_logger.log('Admin ui available at:', 'nice_dev_init')
	kiska_logger.tablog('localhost:5000/admin', false, 'nice_dev_init')
	kiska_logger.line('nice_dev_init')
	kiska_logger.log('Admin has no live-reload!', false, 'nice_dev_init')
	kiska_logger.end('nice_dev_init')
}

clusters['creating_project'] = (context) => {
	kiska_logger.init('ENDURO - CREATING PROJECT')
	kiska_logger.log('Creating new project ' + context.project_name)
	kiska_logger.line()
}

clusters['project_created'] = (context) => {
	kiska_logger.log('Project created successfully.')
	kiska_logger.line()
	kiska_logger.log('Dont forget to cd into project with', true)
	kiska_logger.tablog('$ cd ' + context.project_name, true)
	kiska_logger.log('Then run', true)
	kiska_logger.tablog('$ enduro', true)
	kiska_logger.end()
}

module.exports = new log_clusters()