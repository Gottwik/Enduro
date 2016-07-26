var abstractor = function () {}

abstractor.prototype.init = function(context){
	return new Promise(function(resolve, reject){
		console.log('twitter initialized')
		resolve()
	})
}

abstractor.prototype.abstract = function(context){
	return new Promise(function(resolve, reject){
		var tweet_link = context['tweet']

		if(!tweet_link) {
			return resolve()
		}

		console.log(tweet_link)

	})
}

module.exports = new abstractor()