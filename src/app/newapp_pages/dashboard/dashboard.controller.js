(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('DashboardController', DashboardController)
        .controller('TablesDatatablesController', TablesDatatablesController)
        .controller('BasicDatatableController', BasicDatatableController)
        .controller('ChangeDatatableController', ChangeDatatableController);



    /** @ngInject */
    function DashboardController(moment) {
        var vm = this;

        vm.datePicker = {
            date: {
                startDate: moment().subtract(1, "days"),
                endDate: moment()
            },
            opts: {
                ranges: {
                    'This Month': [moment().startOf('month'), moment()],
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                opens: 'left'
            }
        };
    }


    /** @ngInject */
    function TablesDatatablesController() {

    }

    function BasicDatatableController(DTOptionsBuilder, DTColumnBuilder, $resource, $scope, $q, $http) {

        var vm = this;
        vm.message = '';


        var getData = function () {
            var defer = $q.defer();

            var ref = firebase.database().ref('/projects/');

            ref.on('value', function(snap) {
                // snap.val() comes back as an object with keys
                // these keys need to be come "private" properties
                var data = snap.val();
                var dataWithKeys = Object.keys(data).map(function(key) {
                        var obj = data[key];
                obj._key = key;
                return obj;
            });

                console.log('dataWithKeys', dataWithKeys)

                defer.resolve(dataWithKeys);
            });

            /*firebase.database().ref('/projects/')
             .then(function (snapshot) {
             /*snapshot.forEach(function (childSnapshot) {

             var key = childSnapshot.key;

             var childData = childSnapshot.val();
             console.log(key);
             console.log(childData);
             vm.projects = childData;
             defer.resolve(vm.projects);
             });
             console.log('snapshot', snapshot)
             defer.resolve(snapshot);
             });*/
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
            DTColumnBuilder.newColumn('projectCode').withTitle('Code'),
            DTColumnBuilder.newColumn('client').withTitle('Client'),
            DTColumnBuilder.newColumn('projectName').withTitle('Nom Projet'),
            DTColumnBuilder.newColumn('aV').withTitle('AV'),
            DTColumnBuilder.newColumn('crea').withTitle('Créa'),
            DTColumnBuilder.newColumn('tech').withTitle('Tech'),
            DTColumnBuilder.newColumn('redac').withTitle('Rédac'),
            DTColumnBuilder.newColumn('other').withTitle('Autre'),
            DTColumnBuilder.newColumn('projectManagement').withTitle('Gestion de projet'),
            DTColumnBuilder.newColumn('deliveryDate').withTitle('Date livraison'),
            DTColumnBuilder.newColumn('projectManager').withTitle('projectManager'),
            DTColumnBuilder.newColumn('state').withTitle('Etat'),
            DTColumnBuilder.newColumn('aV2').withTitle('AV'),
            DTColumnBuilder.newColumn('crea2').withTitle('Créa'),
            DTColumnBuilder.newColumn('tech2').withTitle('Tech'),
            DTColumnBuilder.newColumn('redac2').withTitle('Rédac'),
            DTColumnBuilder.newColumn('other2').withTitle('Autre'),
            DTColumnBuilder.newColumn('info1').withTitle('Commentaire').withClass('none'),
            DTColumnBuilder.newColumn('info2').withTitle('Info2').withClass('none'),
            DTColumnBuilder.newColumn('info3').withTitle('Info3').withClass('none')
        ];

        function someClickHandler(info) {
            vm.message = info.id + ' - ' + info.firstName;
        }

        vm.someClickHandler = someClickHandler;

    }

    function ChangeDatatableController($resource, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;

        function _buildPerson2Add(id) {
            return {
                id: id,
                firstName: 'Foo' + id,
                lastName: 'Bar' + id
            };
        }

        function addPerson() {
            vm.persons.push(angular.copy(vm.person2Add));
            vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
        }

        function modifyPerson(index) {
            vm.persons.splice(index, 1, angular.copy(vm.person2Add));
            vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
        }

        function removePerson(index) {
            vm.persons.splice(index, 1);
        }

        vm.persons = $resource('http://www.filltext.com/?rows=16&id={index}&firstName={firstName}&lastName={lastName}&pretty=true').query();
        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withBootstrap();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        vm.person2Add = _buildPerson2Add(1);
        vm.addPerson = addPerson;
        vm.modifyPerson = modifyPerson;
        vm.removePerson = removePerson;

    }





})();


