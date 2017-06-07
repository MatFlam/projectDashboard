(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('DashboardController', DashboardController)
        .controller('TablesDatatablesController', TablesDatatablesController)
        .controller('BasicDatatableController', BasicDatatableController)
        .controller('ChangeDatatableController', ChangeDatatableController)
        .controller('SplashModalsController', SplashModalsController)
        .controller('ModalInstanceController', ModalInstanceController)
        .controller('DatepickerController', DatepickerController)
        .controller('DatepickerPopupController', DatepickerPopupController);


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
                'columnsToggle',
                'colvis',
                'copy',
                'print',
                'excel',
                {
                    text: 'Some button',
                    key: '1',
                    action: function (e, dt, node, config) {
                        alert('Button activated');
                    }
                }
            ]);

        vm.dtColumns = [
            DTColumnBuilder.newColumn('codeProject').withTitle('Code'),
            DTColumnBuilder.newColumn('clientName').withTitle('Client'),
            DTColumnBuilder.newColumn('projectName').withTitle('Nom Projet'),
            DTColumnBuilder.newColumn('aV').withTitle('AV'),
            DTColumnBuilder.newColumn('crea').withTitle('Créa'),
            DTColumnBuilder.newColumn('tech').withTitle('Tech'),
            DTColumnBuilder.newColumn('redac').withTitle('Rédac'),
            DTColumnBuilder.newColumn('other').withTitle('Autre'),
            DTColumnBuilder.newColumn('projectG').withTitle('Gestion de projet'),
            DTColumnBuilder.newColumn('delivery').withTitle('Date livraison'),
            DTColumnBuilder.newColumn('managerProject').withTitle('Chef de projet'),
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

    function SplashModalsController($uibModal, $log) {
        var vm = this;

        vm.openSplash = function(event, size) {

            var options = angular.element(event.target).data('options');
            var modalInstance = $uibModal.open({
                templateUrl: 'app/newapp_pages/modals/views/addProjectForm.html',
                controller: 'ModalInstanceController',
                controllerAs: 'modal',
                size: size,
                backdropClass: 'splash' + ' ' + options,
                windowClass: 'splash' + ' ' + options,
                resolve: {}
            });

            modalInstance.result.then(function (selectedItem) {
                vm.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }

    function ModalInstanceController($uibModalInstance) {
        var vm = this;

        console.log('mic');
        vm.form = {};

        vm.submitForm = function () {
            console.log('addform form is in scope',vm.form);
            var obj = vm.form;
            console.log(obj);
            localStorage.setItem('myStorage', JSON.stringify(obj));
        };

        vm.cancel = function () {
            console.log('oaizueoaizue');
            $uibModalInstance.dismiss('cancel');
        };
    }

    function DatepickerController() {
        var vm = this;

        vm.today = function () {
            vm.dt = new Date();
        };
        vm.today();

        vm.clear = function () {
            vm.dt = null;
        };

        vm.options = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        vm.toggleMin = function () {
            vm.options.minDate = vm.options.minDate ? null : new Date();
        };

        vm.toggleMin();

        vm.setDate = function (year, month, day) {
            vm.dt = new Date(year, month, day);
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date(tomorrow);
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        vm.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < vm.events.length; i++) {
                    var currentDay = new Date(vm.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return vm.events[i].status;
                    }
                }
            }

            return '';
        }
    }


    function DatepickerPopupController(){
        var vm = this;

        vm.today = function() {
            vm.dt = new Date();
        };
        vm.today();

        vm.clear = function() {
            vm.dt = null;
        };

        vm.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        vm.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        vm.toggleMin = function() {
            vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
            vm.dateOptions.minDate = vm.inlineOptions.minDate;
        };

        vm.toggleMin();

        vm.open1 = function() {
            vm.popup1.opened = true;
        };

        vm.open2 = function() {
            vm.popup2.opened = true;
        };

        vm.setDate = function(year, month, day) {
            vm.dt = new Date(year, month, day);
        };

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];
        vm.altInputFormats = ['M!/d!/yyyy'];

        vm.popup1 = {
            opened: false
        };

        vm.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        vm.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < vm.events.length; i++) {
                    var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return vm.events[i].status;
                    }
                }
            }

            return '';
        }
    }

})();


