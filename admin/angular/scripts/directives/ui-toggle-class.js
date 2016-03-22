(function() {
  'use strict';
  angular
    .module('app')
    .directive('uiToggleClass', uiToggleClass);

    uiToggleClass.$inject = ['$timeout', '$document'];
    function uiToggleClass($timeout, $document) {
      return {
        restrict: 'AC',
        link: link
      };

      function link(scope, el, attr) {
        el.on('click', function(e) {
          e.preventDefault();
          var classes = attr.uiToggleClass.split(','),
              targets = (attr.uiTarget && attr.uiTarget.split(',')) || (attr.target && attr.target.split(',')) || Array(el),
              key = 0;
              
          angular.forEach(classes, function( _class ) {
            var target = $( targets[(targets.length && key)] ),
                current = $( target ).attr('ui-class');

            (current != _class) && target.removeClass( $( target ).attr('ui-class') );
            target.toggleClass(_class);
            $( target ).attr('ui-class', _class);

            key ++;
          });
          el.toggleClass('active');

        });
      }
    }
})();
