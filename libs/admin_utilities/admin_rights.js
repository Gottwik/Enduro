// * ———————————————————————————————————————————————————————— * //
// * 	checking which user can do what
// *
// * 	activities = ['read', 'write', 'temp', 'delete']
// * 	users = ['', 'demo']
// *
// * ———————————————————————————————————————————————————————— * //
var admin_rights = function () {}

// constants
var rights = {
	demo: ['read', 'temp']
}

admin_rights.prototype.can_user_do_that = function (user, activity) {

	var user_tags = user.tags

	// if no user is provided we assume it is superuser(simple setup)
	if (!user_tags) {
		return true
	}

	for (u in user_tags) {
		if (!can_tag_do_that(user_tags[u], activity)) {
			return false
		}
	}

	return true
}

function can_tag_do_that (tag, activity) {
	// if tag is undefined here
	if (!(tag in rights)) {
		return false
	}

	return rights[tag].indexOf(activity) + 1
}

module.exports = new admin_rights()
