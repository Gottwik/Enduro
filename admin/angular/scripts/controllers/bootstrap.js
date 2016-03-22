(function() {
  'use strict';
  angular
    .module('app')
    .controller('AccordionCtl', AccordionCtl)
    .controller('AlertCtl', AlertCtl)
    .controller('ButtonsCtl', ButtonsCtl)
    .controller('CarouselCtl', CarouselCtl)
    .controller('DropdownCtl', DropdownCtl)
    .controller('ModalInstanceCtl', ModalInstanceCtl)
    .controller('ModalCtl', ModalCtl)
    .controller('PaginationCtl', PaginationCtl)
    .controller('PopoverCtl', PopoverCtl)
    .controller('ProgressCtl', ProgressCtl)
    .controller('TabsCtl', TabsCtl)
    .controller('RatingCtl', RatingCtl)
    .controller('TabsCtl', TabsCtl)
    .controller('TooltipCtl', TooltipCtl)
    .controller('TypeaheadCtl', TypeaheadCtl)
    .controller('DatepickerCtl', DatepickerCtl)
    .controller('TimepickerCtl', TimepickerCtl)
    ;
    function AccordionCtl($scope) {
      var vm = $scope;
      vm.oneAtATime = true;
      vm.groups = [
        {
          title: 'Accordion group header - #1',
          content: 'Dynamic group body - #1'
        },
        {
          title: 'Accordion group header - #2',
          content: 'Dynamic group body - #2'
        }
      ];

      vm.items = ['Item 1', 'Item 2', 'Item 3'];

      $scope.addItem = function() {
        var newItemNo = vm.items.length + 1;
        vm.items.push('Item ' + newItemNo);
      };

      vm.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };
    }

    function AlertCtl($scope) {
      var vm = $scope;
      vm.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
      ];

      vm.addAlert = function() {
        vm.alerts.push({msg: 'Another alert!'});
      };

      vm.closeAlert = function(index) {
        vm.alerts.splice(index, 1);
      };
    }

    function ButtonsCtl($scope) {
      var vm = $scope;
      vm.singleModel = 1;

      vm.radioModel = 'Middle';

      vm.checkModel = {
        left: false,
        middle: true,
        right: false
      };

      vm.checkResults = [];

      vm.$watchCollection('checkModel', function () {
        vm.checkResults = [];
        angular.forEach(vm.checkModel, function (value, key) {
          if (value) {
            vm.checkResults.push(key);
          }
        });
      });
    }

    function CarouselCtl($scope) {
      var vm = $scope;
      vm.myInterval = 5000;
      vm.noWrapSlides = false;
      var slides = vm.slides = [];
      $scope.addSlide = function() {
        slides.push({
          image: 'assets/images/c' + slides.length + '.jpg',
          text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][slides.length % 4]
        });
      };
      for (var i=0; i<4; i++) {
        vm.addSlide();
      }
    }

    function DropdownCtl($scope) {
      var vm = $scope;
      vm.items = [
        'The first choice!',
        'And another choice for you.',
        'but wait! A third!'
      ];

      vm.status = {
        isopen: false
      };

      vm.toggled = function(open) {
        //console.log('Dropdown is now: ', open);
      };

      vm.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.status.isopen = !vm.status.isopen;
      };
    }
    
    ModalInstanceCtl.$inject = ['$scope', '$uibModalInstance', 'items'];
    function ModalInstanceCtl($scope, $uibModalInstance, items) {
      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };

      $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }

    ModalCtl.$inject = ['$scope', '$uibModal', '$log'];
    function ModalCtl($scope, $uibModal, $log) {
      $scope.items = ['item1', 'item2', 'item3'];
      $scope.open = function (size) {
        var modalInstance = $uibModal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtl',
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    }

    function PaginationCtl($scope) {
      $scope.totalItems = 64;
      $scope.currentPage = 4;

      $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
      };

      $scope.pageChanged = function() {
        
      };

      $scope.maxSize = 5;
      $scope.bigTotalItems = 175;
      $scope.bigCurrentPage = 1;
    }

    function PopoverCtl($scope) {
      $scope.dynamicPopover = 'Hello, World!';
      $scope.dynamicPopoverTitle = 'Title';
    }

    function ProgressCtl($scope) {
      $scope.max = 200;

      $scope.random = function() {
        var value = Math.floor((Math.random() * 100) + 1);
        var type;

        if (value < 25) {
          type = 'success';
        } else if (value < 50) {
          type = 'info';
        } else if (value < 75) {
          type = 'warning';
        } else {
          type = 'danger';
        }

        $scope.showWarning = (type === 'danger' || type === 'warning');

        $scope.dynamic = value;
        $scope.type = type;
      };
      $scope.random();

      $scope.randomStacked = function() {
        $scope.stacked = [];
        var types = ['success', 'info', 'warning', 'danger'];

        for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
            var index = Math.floor((Math.random() * 4));
            $scope.stacked.push({
              value: Math.floor((Math.random() * 30) + 1),
              type: types[index]
            });
        }
      };
      $scope.randomStacked();
    }

    function TabsCtl($scope) {
      $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
      ];
    }

    function RatingCtl($scope) {
      $scope.rate = 7;
      $scope.max = 10;
      $scope.isReadonly = false;

      $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
      };
    }

    function TooltipCtl($scope) {
      $scope.dynamicTooltip = 'Hello, World!';
      $scope.dynamicTooltipText = 'dynamic';
      $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
    }

    TypeaheadCtl.$inject = ['$scope', '$http'];
    function TypeaheadCtl($scope, $http) {
      $scope.selected = undefined;
      $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
      // Any function returning a promise object can be used to load values asynchronously
      $scope.getLocation = function(val) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: val,
            sensor: false
          }
        }).then(function(res){
          var addresses = [];
          angular.forEach(res.data.results, function(item){
            addresses.push(item.formatted_address);
          });
          return addresses;
        });
      };
    }

    function DatepickerCtl($scope) {
      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
        $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
      };

      $scope.initDate = new Date('2016-15-20');
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
    }

    function TimepickerCtl($scope) {
      $scope.mytime = new Date();

      $scope.hstep = 1;
      $scope.mstep = 15;

      $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      };

      $scope.ismeridian = true;
      $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
      };

      $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.mytime = d;
      };

      $scope.changed = function () {
        //console.log('Time changed to: ' + $scope.mytime);
      };

      $scope.clear = function() {
        $scope.mytime = null;
      };
    }
})();
