(function() {
  'use strict';
  angular
    .module('app')
    .directive('uiFullscreen', uiFullscreen);

    uiFullscreen.$inject = ['$ocLazyLoad', '$document'];
    function uiFullscreen($ocLazyLoad, $document) {
      var directive = {
          restrict: 'AC',
          link: link
      };
      return directive;
      
      function link(scope, el, attr) {
          el.addClass('hide');
          $ocLazyLoad.load('libs/jquery/screenfull/dist/screenfull.min.js').then(function(){
            if (screenfull.enabled) {
              el.removeClass('hide');
            } else{
              return;
            }
            el.bind('click', function(){
              var target;
              attr.target && ( target = angular.element(attr.target)[0] );
              screenfull.toggle(target);
            });

            var body = angular.element($document[0].body);
            $document.on(screenfull.raw.fullscreenchange, function () {
              if(screenfull.isFullscreen){
                body.addClass('fullscreen');
              }else{
                body.removeClass('fullscreen');
              }
            });
          });
      }
    }
})();
