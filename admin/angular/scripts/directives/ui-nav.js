(function() {
  'use strict';
  angular
    .module('app')
    .directive('uiNav', uiNav);
    function uiNav() {
      var directive = {
        restrict: 'AC',
        link: link
      };
      return directive;
    }
    function link(scope, el, attr) {
      el.find('a').bind('click', function(e) {
        var li = angular.element(this).parent();
        var active = li.parent()[0].querySelectorAll('.active');
        li.toggleClass('active');
        angular.element(active).removeClass('active');
      });
    }
})();
