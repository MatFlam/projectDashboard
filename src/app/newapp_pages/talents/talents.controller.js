(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('TalentsController', TalentsController)
        .controller('TalentsDatatablesController', TalentsDatatablesController)
        .controller('TalentsBasicDatatableController', TalentsBasicDatatableController);



    /** @ngInject */
    function TalentsController() {

    }

    /** @ngInject */
    function TalentsDatatablesController() {

    }

    function TalentsBasicDatatableController(DTOptionsBuilder, DTColumnBuilder, $resource, $scope, $q, $http, $firebaseArray) {

      var talents = this;
      talents.lastSlotMeta = false;

      talents.model = {
        //locale: localeService.$locale.id,
        options: {/*monoSchedule: true*/},
        items: []
      };

      var rootRef = firebase.database().ref();
      var ref = rootRef.child('users');

      talents.model.items = $firebaseArray(ref);
      var getData = talents.model.items.$loaded();


        function rowCallback(nRow, aData) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('td', nRow).unbind('click');
            angular.element('td', nRow).bind('click', function () {
                /* eslint-disable */
                $scope.$apply(function () {
                    talents.someClickHandler(aData);
                });
                /* esling-enable */
                angular.element('.row_selected').removeClass('row_selected');
                angular.element(nRow).addClass('row_selected');
            });
            return nRow;
        }

        talents.dtOptions = DTOptionsBuilder.fromFnPromise(getData)
            .withPaginationType('full_numbers')
            .withBootstrap() // Activate col reorder plugin
            .withColReorder()
            .withColReorderCallback(function () {
                console.log('Columns order has been changed with: ' + this.fnOrder());
            })
            .withOption('rowCallback', rowCallback)
            .withOption('responsive', true)
            .withButtons(['colvis', 'copy', 'print', 'excel']);

        talents.dtColumns = [
            DTColumnBuilder.newColumn('firstName').withTitle('Prénom'),
            DTColumnBuilder.newColumn('name').withTitle('Nom'),
            DTColumnBuilder.newColumn('job').withTitle('Métier'),
            DTColumnBuilder.newColumn('level').withTitle('Niveau d\'expertise'),
            DTColumnBuilder.newColumn('email').withTitle('Email')
        ];

        function someClickHandler(info) {
            talents.message = info.id + ' - ' + info.firstName;
        }

        talents.someClickHandler = someClickHandler;
    }
})();


