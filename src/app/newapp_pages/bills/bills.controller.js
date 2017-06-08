(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('BillsController', BillsController)
        .controller('BillDatatableController', BillDatatableController);


    /** @ngInject */
    function BillsController() {

    }

    function BillDatatableController(DTOptionsBuilder, DTColumnBuilder, $resource, $scope, $q, $http) {

        var vm = this;
        vm.message = '';


        var getData = function(){
            var defer = $q.defer();
            $http.get('app/json/projects.json')
                .then(function (response) {
                    $scope.projects = response.data;
                    $scope.obj = JSON.parse(localStorage.getItem('myStorage'));
                    defer.resolve(response.data);
                });
            return defer.promise;
        };


        function rowCallback(nRow, aData) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('td', nRow).unbind('click');
            angular.element('td', nRow).bind('click', function () {
                /* eslint-disable */
                $scope.$apply(function () {
                    vm.someClickHandler(aData);
                });
                /* esling-enable */
                angular.element('.row_selected').removeClass('row_selected');
                angular.element(nRow).addClass('row_selected');
            });
            return nRow;
        }

        vm.dtOptions = DTOptionsBuilder.fromFnPromise(getData)
            .withPaginationType('full_numbers')
            .withBootstrap() // Activate col reorder plugin
            .withColReorder()
            .withColReorderCallback(function () {
                console.log('Columns order has been changed with: ' + this.fnOrder());
            })
            .withOption('rowCallback', rowCallback)
            .withOption('responsive', true)
            .withButtons([
                'colvis',
                'copy',
                'print',
                'excel'
                // {
                //     text: 'Some button',
                //     key: '1',
                //     action: function (e, dt, node, config) {
                //         alert('Button activated');
                //     }
                // }
            ]);

        vm.dtColumns = [
            DTColumnBuilder.newColumn('dirCli').withTitle('Directeur clientèle'),
            DTColumnBuilder.newColumn('clientName').withTitle('Client'),
            DTColumnBuilder.newColumn('subContracting').withTitle('Sous-traitance'),
            DTColumnBuilder.newColumn('projectCode').withTitle('Code offre'),
            DTColumnBuilder.newColumn('productionDate').withTitle('Date prod'),
            DTColumnBuilder.newColumn('totalAmount').withTitle('Montant total'),
            DTColumnBuilder.newColumn('chargedAmount').withTitle('Montant facturé'),
            DTColumnBuilder.newColumn('commission').withTitle('Commission'),
            DTColumnBuilder.newColumn('billingDate').withTitle('Date facturation'),
            DTColumnBuilder.newColumn('deliveryDate').withTitle('Date livraison')
        ];

        function someClickHandler(info) {
            vm.message = info.id + ' - ' + info.firstName;
        }

        vm.someClickHandler = someClickHandler;

    }


})();