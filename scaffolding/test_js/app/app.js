var local_app = function () {}

local_app.prototype.init = function (app) {
	// express app available here
	// don't forget these routes will not be available on development server but rather on localhost:5000
}

module.exports = new local_app()
