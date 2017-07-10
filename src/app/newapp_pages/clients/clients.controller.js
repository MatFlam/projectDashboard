(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('ClientsController', clientsController)
        .controller('ClientsTablesDatatablesController', ClientsTablesDatatablesController)
        .controller('ClientsBasicDatatableController', ClientsBasicDatatableController)
        .controller('ClientsChangeDatatableController', ClientsChangeDatatableController);



    /** @ngInject */
    function clientsController(moment) {
        var clients = this;
        
        clients.model = {
            locale: localeService.$locale.id,
            items: [
                // {
                //   'label': 'Item 1',
                //   'editable': true,
                //   'schedules': {
                //     'predicted': [{
                //       'project': 'Projet X',
                //       'client': 'DSK',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T10:00:00.000+02'
                //     }],
                //     'realised': [{
                //       'project': 'Black bird',
                //       'client': 'NSA',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T12:00:00.000+02'
                //     }]
                //   }
                // },
                // {
                //   'label': 'Item 2',
                //   'editable': true,
                //   'schedules': {
                //     'predicted': [{
                //       'project': 'Projet X',
                //       'client': 'DSK',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T10:00:00.000+02'
                //     }],
                //     'realised': [{
                //       'project': 'Moon',
                //       'client': 'NASA',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T12:00:00.000+02'
                //     }]
                //   }
                // }
            ]
        };

        clients.datePicker = {
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
    function ClientsTablesDatatablesController() {

    }

    function ClientsBasicDatatableController(DTOptionsBuilder, DTColumnBuilder, $resource, $scope, $q, $http, $firebaseArray) {

        var clients = this;
        clients.message = '';
        clients.model = {
            //locale: localeService.$locale.id,
            options: {/*monoSchedule: true*/},
            items: [
                // {
                //   'label': 'Item 1',
                //   'editable': true,
                //   'schedules': {
                //     'predicted': [{
                //       'project': 'Projet X',
                //       'client': 'DSK',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T10:00:00.000+02'
                //     }],
                //     'realised': [{
                //       'project': 'Black bird',
                //       'client': 'NSA',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T12:00:00.000+02'
                //     }]
                //   }
                // },
                // {
                //   'label': 'Item 2',
                //   'editable': true,
                //   'schedules': {
                //     'predicted': [{
                //       'project': 'Projet X',
                //       'client': 'DSK',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T10:00:00.000+02'
                //     }],
                //     'realised': [{
                //       'project': 'Moon',
                //       'client': 'NASA',
                //       'start': '2017-06-20T08:00:00.000+02',
                //       'end': '2017-06-20T12:00:00.000+02'
                //     }]
                //   }
                // }
            ]
        };


        var getData = function () {
            var defer = $q.defer();

            var ref = firebase.database().ref('/clients/');

            clients.model.items = $firebaseArray(ref);

            /*firebase.database().ref('/projects/')
             .then(function (snapshot) {
             /*snapshot.forEach(function (childSnapshot) {

             var key = childSnapshot.key;

             var childData = childSnapshot.val();
             console.log(key);
             console.log(childData);
             clients.projects = childData;
             defer.resolve(clients.projects);
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
                    clients.someClickHandler(aData);
                });
                /* esling-enable */
                angular.element('.row_selected').removeClass('row_selected');
                angular.element(nRow).addClass('row_selected');
            });
            return nRow;
        }

        clients.dtOptions = DTOptionsBuilder.fromFnPromise(getData)
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

        clients.dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Nom'),
            DTColumnBuilder.newColumn('projectName').withTitle('Nom Projet')
        ];

        function someClickHandler(info) {
            clients.message = info.id + ' - ' + info.firstName;
        }

        clients.someClickHandler = someClickHandler;

    }

    function ClientsChangeDatatableController($resource, DTOptionsBuilder, DTColumnDefBuilder) {

        var clients = this;

        function _buildPerson2Add(id) {
            return {
                id: id,
                firstName: 'Foo' + id,
                lastName: 'Bar' + id
            };
        }

        function addPerson() {
            clients.persons.push(angular.copy(clients.person2Add));
            clients.person2Add = _buildPerson2Add(clients.person2Add.id + 1);
        }

        function modifyPerson(index) {
            clients.persons.splice(index, 1, angular.copy(clients.person2Add));
            clients.person2Add = _buildPerson2Add(clients.person2Add.id + 1);
        }

        function removePerson(index) {
            clients.persons.splice(index, 1);
        }

        clients.persons = $resource('http://www.filltext.com/?rows=16&id={index}&firstName={firstName}&lastName={lastName}&pretty=true').query();
        clients.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withBootstrap();
        clients.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        clients.person2Add = _buildPerson2Add(1);
        clients.addPerson = addPerson;
        clients.modifyPerson = modifyPerson;
        clients.removePerson = removePerson;

    }





})();


