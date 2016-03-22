// code style: https://github.com/johnpapa/angular-styleguide 

(function() {
    'use strict';
    angular
      .module('app')
      .controller('GoogleMapCtrl', GoogleMap);

      function GoogleMap ($scope) {
        var vm = $scope;
        vm.myMarkers = [];

        vm.mapOptions = {
          center: new google.maps.LatLng(35.784, -98.670),
          zoom: 4,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        vm.addMarker = addMarker;
        vm.setZoomMessage = setZoomMessage;
        vm.openMarkerInfo = openMarkerInfo;
        vm.setMarkerPosition = setMarkerPosition;

        function addMarker($event, $params) {
          vm.myMarkers.push(new google.maps.Marker({
            map: vm.myMap,
            position: $params[0].latLng
          }));
        };

        function setZoomMessage(zoom) {
          vm.zoomMessage = 'You just zoomed to ' + zoom + '!';
        };

        function openMarkerInfo(marker) {
          vm.currentMarker = marker;
          vm.currentMarkerLat = marker.getPosition().lat();
          vm.currentMarkerLng = marker.getPosition().lng();
          vm.myInfoWindow.open(vm.myMap, marker);
        };

        function setMarkerPosition(marker, lat, lng) {
          marker.setPosition(new google.maps.LatLng(lat, lng));
        };
      }


})();
