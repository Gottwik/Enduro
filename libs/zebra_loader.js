var path = require('path');

var zebra_loader = function () {}

zebra_loader.prototype._invalidateRequireCacheForFile = function(filePath){
	delete require.cache[path.resolve(filePath)];
}

zebra_loader.prototype.load = function(filePath){
	this._invalidateRequireCacheForFile(filePath);
	return require(filePath);
}

module.exports = new zebra_loader()