// code style: https://github.com/johnpapa/angular-styleguide 

(function() {
    'use strict';
    angular
        .module('app')
        .controller('TableCtrl', TableCtrl);

        TableCtrl.$inject =  ['$scope', '$timeout'];

        function TableCtrl($scope, $timeout) {
          var vm = $scope;

          vm.rowCollectionBasic = [
              {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
              {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
              {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
          ];

          vm.removeRow = removeRow;

          vm.predicates = ['firstName', 'lastName', 'birthDate', 'balance', 'email'];
          vm.selectedPredicate = vm.predicates[0];

          var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
          var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
          var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
          var id = 1;

          vm.rowCollection = [];

          for (id; id < 5; id++) {
              vm.rowCollection.push(generateRandomItem(id));
          }

          //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
          vm.displayedCollection = [].concat(vm.rowCollection);

          //add to the real data holder
          vm.addRandomItem = addRandomItem;

          //remove to the real data holder
          vm.removeItem = removeItem;

          //  pagination
          vm.itemsByPage=10;

          vm.rowCollectionPage = [];
          for (var j = 0; j < 200; j++) {
            vm.rowCollectionPage.push(generateRandomItem(j));
          }

          // pip
          var promise = null;
          vm.isLoading = false;
          vm.rowCollectionPip = [];
          vm.getPage = getPage;

          vm.callServer = callServer;

          vm.getPage();

          function getPage() {
            vm.rowCollectionPip=[];
            for (var j = 0; j < 20; j++) {
              vm.rowCollectionPip.push(generateRandomItem(j));
            }
          }

          function removeRow(row) {
              var index = vm.rowCollectionBasic.indexOf(row);
              if (index !== -1) {
                  vm.rowCollectionBasic.splice(index, 1);
              }
          };

          function removeItem(row) {
              var index = vm.rowCollection.indexOf(row);
              if (index !== -1) {
                  vm.rowCollection.splice(index, 1);
              }
          }

          function addRandomItem() {
              vm.rowCollection.push(generateRandomItem(id));
              id++;
          }

          function callServer(tableState) {
              //here you could create a query string from tableState
              //fake ajax call
              vm.isLoading = true;

              $timeout(function () {
                  vm.getPage();
                  vm.isLoading = false;
              }, 2000);
          }

          function generateRandomItem(id) {

              var firstname = firstnames[Math.floor(Math.random() * 3)];
              var lastname = lastnames[Math.floor(Math.random() * 3)];
              var birthdate = dates[Math.floor(Math.random() * 3)];
              var balance = Math.floor(Math.random() * 2000);

              return {
                  id: id,
                  firstName: firstname,
                  lastName: lastname,
                  birthDate: new Date(birthdate),
                  balance: balance
              }
          }

        }
})();
