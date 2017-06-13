(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('SplashModalsController', SplashModalsController)
        .controller('ModalInstanceController', ModalInstanceController)
        // .controller('DatepickerController', DatepickerController)
        .controller('DatepickerPopupController', DatepickerPopupController);


    /** @ngInject */
    function SplashModalsController($uibModal, $log) {
        var vm = this;

        vm.openSplash = function (event, size) {

            var options = angular.element(event.target).data('options');
            var modalInstance = $uibModal.open({
                templateUrl: 'app/newapp_pages/modals/addProjectForm.html',
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

    /** @ngInject */
    function ModalInstanceController($uibModalInstance) {
        var vm = this;

        vm.form = {};

        vm.submitForm = function () {
            console.log('addform form is in scope', vm.form);
            firebase.database().ref('projects/').push({
                projectCode: JSON.stringify(vm.form.projectCode),
                client: JSON.stringify(vm.form.client),
                projectName: JSON.stringify(vm.form.projectName),
                aV: JSON.stringify(vm.form.aV),
                crea: JSON.stringify(vm.form.crea),
                tech: JSON.stringify(vm.form.tech),
                redac: JSON.stringify(vm.form.redac),
                other: JSON.stringify(vm.form.other),
                projectManagement: JSON.stringify(vm.form.projectManagement),
                deliveryDate: JSON.stringify(vm.form.deliveryDate),
                projectManager: JSON.stringify(vm.form.projectManager),
                dirCli: JSON.stringify(vm.form.dirCli),
                subContracting: JSON.stringify(vm.form.subContracting),
                productionDate: JSON.stringify(vm.form.productionDate),
                totalAmount: JSON.stringify(vm.form.totalAmount),
                chargedAmount: JSON.stringify(vm.form.chargedAmount),
                commission: JSON.stringify(vm.form.commission),
                billingDate: JSON.stringify(vm.form.billingDate)
            });
        };

        vm.cancel = function () {
            console.log('oaizueoaizue');
            $uibModalInstance.dismiss('cancel');
        };
    }

    // function DatepickerController() {
    //     var vm = this;
    //
    //     vm.today = function () {
    //         vm.dt = new Date();
    //     };
    //     vm.today();
    //
    //     vm.clear = function () {
    //         vm.dt = null;
    //     };
    //
    //     vm.options = {
    //         customClass: getDayClass,
    //         minDate: new Date(),
    //         showWeeks: true
    //     };
    //
    //     vm.toggleMin = function () {
    //         vm.options.minDate = vm.options.minDate ? null : new Date();
    //     };
    //
    //     vm.toggleMin();
    //
    //     vm.setDate = function (year, month, day) {
    //         vm.dt = new Date(year, month, day);
    //     };
    //
    //     var tomorrow = new Date();
    //     tomorrow.setDate(tomorrow.getDate() + 1);
    //     var afterTomorrow = new Date(tomorrow);
    //     afterTomorrow.setDate(tomorrow.getDate() + 1);
    //     vm.events = [
    //         {
    //             date: tomorrow,
    //             status: 'full'
    //         },
    //         {
    //             date: afterTomorrow,
    //             status: 'partially'
    //         }
    //     ];
    //
    //     function getDayClass(data) {
    //         var date = data.date,
    //             mode = data.mode;
    //         if (mode === 'day') {
    //             var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
    //
    //             for (var i = 0; i < vm.events.length; i++) {
    //                 var currentDay = new Date(vm.events[i].date).setHours(0, 0, 0, 0);
    //
    //                 if (dayToCheck === currentDay) {
    //                     return vm.events[i].status;
    //                 }
    //             }
    //         }
    //
    //         return '';
    //     }
    // }


    function DatepickerPopupController() {
        var vm = this;

        vm.today = function () {
            vm.dt = new Date();
        };
        vm.today();

        vm.clear = function () {
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

        vm.toggleMin = function () {
            vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
            vm.dateOptions.minDate = vm.inlineOptions.minDate;
        };

        vm.toggleMin();

        vm.open1 = function () {
            vm.popup1.opened = true;
        };

        vm.open2 = function () {
            vm.popup2.opened = true;
        };

        vm.setDate = function (year, month, day) {
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

})();