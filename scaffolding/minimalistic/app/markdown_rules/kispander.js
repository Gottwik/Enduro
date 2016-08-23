module.exports = function (input) {
	return input.replace(new RegExp(/\[(.+?)\]{(.+?)}/g), '<a class="kispander-link" href="#ksp/$2">$1</a>')
}
