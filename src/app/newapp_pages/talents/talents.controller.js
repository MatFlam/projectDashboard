(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('TalentsController', TalentsController)
        .controller('TalentsTablesDatatablesController', TalentsTablesDatatablesController)
        .controller('TalentsBasicDatatableController', TalentsBasicDatatableController)
        .controller('TalentsChangeDatatableController', TalentsChangeDatatableController);



    /** @ngInject */
    function TalentsController() {}

    /** @ngInject */
    function TalentsTablesDatatablesController() {}

    function TalentsBasicDatatableController(DTOptionsBuilder, DTColumnBuilder, $resource, $scope, $q, $http, $firebaseArray) {

        var talents = this;

        var getData = function () {
            var defer = $q.defer();
            var rootRef = firebase.database().ref();
            var ref = rootRef.child('talents');

            talents.model.items = $firebaseArray(ref);
            talents.model.items.$loaded().then(
                defer.resolve('unable to resolve "talents promise"', talents.model.items)
            );
            return defer.promise;
        };


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
            DTColumnBuilder.newColumn('avatar').withTitle('Photo'),
            DTColumnBuilder.newColumn('firstname').withTitle('Prénom'),
            DTColumnBuilder.newColumn('name').withTitle('Name'),
            DTColumnBuilder.newColumn('job').withTitle('Métier'),
            DTColumnBuilder.newColumn('level').withTitle('Niveau d\'expertise'),
            DTColumnBuilder.newColumn('email').withTitle('Email')
        ];

        function someClickHandler(info) {
            talents.message = info.id + ' - ' + info.firstName;
        }

        talents.someClickHandler = someClickHandler;

        talents.submitFormAdd = function () {
            console.log('addform form is in scope', talents.add);
            firebase.database().ref('talents/').push({
                avatar: JSON.stringify(talents.add.avatar),
                name: JSON.stringify(talents.form.name),
                firstname: JSON.stringify(talents.form.firstName),
                job: JSON.stringify(talents.add.job),
                level: JSON.stringify(talents.add.level)
            });

            talents.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withBootstrap();
            //talents.dtColumnDefs = [
            //    DTColumnDefBuilder.newColumnDef(0),
            //    DTColumnDefBuilder.newColumnDef(1),
            //    DTColumnDefBuilder.newColumnDef(2),
            //    DTColumnDefBuilder.newColumnDef(3).notSortable()
            //];
            talents.talent2Add = _buildTalent2Add(1);
            talents.addTalent = addTalent;
            talents.modifyTalent = modifyTalent;
            talents.removeTalent = removeTalent;
        }
    }
})();


