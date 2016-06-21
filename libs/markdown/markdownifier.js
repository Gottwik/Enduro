// * ———————————————————————————————————————————————————————— * //
// * 	markdownifier
// * ———————————————————————————————————————————————————————— * //
var markdownifier = function () {}

// Goes through the pages and renders them
markdownifier.prototype.markdownify = function(input) {
	deep_markdown(input)
}

function deep_markdown(object) {
	for(o in object) {
		if(typeof object[o] === 'object') {
			deep_markdown(object[o])
		}
		if(typeof object[o] === 'string') {
			object[o] = apply_markdown(object[o])
		}
	}
}

function apply_markdown(input) {
	for(r in markdown_rules) {
		input = markdown_rules[r](input)
	}
	return input
}


var markdown_rules = {}

markdown_rules['links'] = function(input) {
	return input.replace(new RegExp(/\[(.+?)\]\((.+?)\)/g), '<a href="$2">$1</a>')
}

markdown_rules['kispander-links'] = function(input) {
	return input.replace(new RegExp(/\[(.+?)\]{(.+?)}/g), '<a class="kispander-link" href="#ksp/$2">$1</a>')
}


module.exports = new markdownifier()