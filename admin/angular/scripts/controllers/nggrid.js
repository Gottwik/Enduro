// code style: https://github.com/johnpapa/angular-styleguide 

(function() {
    'use strict';
    angular
        .module('app')
        .controller('NGGridCtrl', NGGridCtrl);

        NGGridCtrl.$inject = ['$scope', '$http']; 
        function NGGridCtrl($scope, $http) {
            var vm = $scope;
            vm.filterOptions = {
                filterText: "",
                useExternalFilter: true
            }; 
            vm.totalServerItems = 0;
            vm.pagingOptions = {
                pageSizes: [250, 500, 1000],
                pageSize: 250,
                currentPage: 1
            };
            vm.setPagingData = setPagingData;
            vm.getPagedDataAsync = getPagedDataAsync;

            vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage);

            vm.gridOptions = {
                data: 'myData',
                enablePaging: true,
                showFooter: true,
                rowHeight: 36,
                headerRowHeight: 36,
                totalServerItems: 'totalServerItems',
                pagingOptions: vm.pagingOptions,
                filterOptions: vm.filterOptions
            };

            vm.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                  vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage, vm.filterOptions.filterText);
                }
            }, true);
            vm.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                  vm.getPagedDataAsync(vm.pagingOptions.pageSize, vm.pagingOptions.currentPage, vm.filterOptions.filterText);
                }
            }, true);

            function setPagingData(data, page, pageSize){  
                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                vm.myData = pagedData;
                vm.totalServerItems = data.length;
                if (!vm.$$phase) {
                    vm.$apply();
                }
            };
            
            function getPagedDataAsync(pageSize, page, searchText) {
                setTimeout(function () {
                    var data;
                    if (searchText) {
                        var ft = searchText.toLowerCase();
                        $http.get('scripts/controllers/largeLoad.json').success(function (largeLoad) {    
                            data = largeLoad.filter(function(item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            vm.setPagingData(data,page,pageSize);
                        });            
                    } else {
                        $http.get('scripts/controllers/largeLoad.json').success(function (largeLoad) {
                            vm.setPagingData(largeLoad,page,pageSize);
                        });
                    }
                }, 100);
            };
        }
})();
