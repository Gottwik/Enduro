var api_call = function () {}

api_call.prototype.call = function(req, res, query){
	res.send('test api working')
}

module.exports = new api_call()