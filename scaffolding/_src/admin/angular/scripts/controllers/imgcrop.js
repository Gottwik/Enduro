// code style: https://github.com/johnpapa/angular-styleguide 

(function() {
    'use strict';
    angular
      .module('app')
      .controller('ImgCropCtrl', ImgCrop);

    function ImgCrop($scope) {
      var vm = $scope;
      vm.myImage='';
      vm.myCroppedImage='';
      vm.cropType="circle";

      var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          vm.$apply(function(vm){
            vm.myImage=evt.target.result;
          });
        };
        reader.readAsDataURL(file);
      };
      angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    }

})();
