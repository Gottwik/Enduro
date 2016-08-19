require.config({
	baseUrl: '/assets/',

	paths: {
		// 'jquery': 'vendor/jquery/dist/jquery.min',
	},
})

require(['jquery'], function ($) {
	$(document).ready(function () {
		console.log('requirejs ready to use')
	})
})
