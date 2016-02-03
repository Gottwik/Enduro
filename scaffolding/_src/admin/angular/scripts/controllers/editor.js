// code style: https://github.com/johnpapa/angular-styleguide 

(function() {
    'use strict';
    angular
    	.module('app')
    	.controller('EditorCtrl', EditorCtrl);

      	function EditorCtrl($scope) {
      	  var vm = $scope;
  		  vm.options = {
            height: 150,
            toolbar: [
              ['style', ['bold', 'italic', 'underline', 'clear']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['height', ['height']]
            ]
          };
          vm.text = '<h3>Try me!</h3><p>Super Simple WYSIWYG Editor on Bootstrap</p><p><b>Features:</b></p><ol><li>Worldwide Bootstrap</li><li style="color: blue;">Easy to Install</li><li><strong>Open Source</strong></li><li>Customizing</li><li>Smart Shortcuts</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/summernote/summernote/">Here</a> </p>';
		}
})();
