(function () {
  'use strict';

  angular
    .module('minotaur')
    .controller('SplashModalsController', SplashModalsController)
    .controller('ModalInstanceController', ModalInstanceController)
    .controller('DatepickerPopupController', DatepickerPopupController);


  /** @ngInject */
  function SplashModalsController($uibModal, $log) {
    var vm = this;

    vm.openSplash = function (event, size, row) {

      var options = angular.element(event.target).data('options');
      var modalInstance = $uibModal.open({
        templateUrl: 'app/newapp_pages/modals/addProjectForm.html',
        controller: 'ModalInstanceController',
        controllerAs: 'modal',
        size: size,
        backdropClass: 'splash' + ' ' + options,
        windowClass: 'splash' + ' ' + options,
        resolve: {
          row: function () {
            return row;
          }
        }
      });

      modalInstance.result.then(function (topush) {

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }

  /** @ngInject */
  function ModalInstanceController($uibModalInstance, $firebaseArray, row) {
    console.log("row début", row);
    var vm = this;

    var users = this;

    users.lastSlotMeta = false;

    users.projectManager = {
      //locale: localeService.$locale.id,
      options: {/*monoSchedule: true*/},
      items: []
    };

    users.dirCli = {
      //locale: localeService.$locale.id,
      options: {/*monoSchedule: true*/},
      items: []
    };

    var rootRef = firebase.database().ref();
    var ref = rootRef.child('users');

    users.projectManager.items = $firebaseArray(ref.orderByChild('job').equalTo('redac'));
    users.dirCli.items = $firebaseArray(ref.orderByChild('job').equalTo('other'));

    if (row === undefined) {

      vm.form = {};
      vm.form.projectCode = "";
      vm.form.client = "";
      vm.form.projectName = "";
      vm.form.aV = 0;
      vm.form.crea = 0;
      vm.form.tech = 0;
      vm.form.redac = 0;
      vm.form.other = 0;
      vm.form.projectManagement = 0;
      vm.form.deliveryDate = "";
      vm.form.projectManager = "";
      vm.form.dirCli = "";
      vm.form.subContracting = "";
      vm.form.productionDate = "";
      vm.form.totalAmount = "";
      vm.form.comment = "";
      vm.form.firstBillRate = 0;
      vm.form.firstBillDate = "";
      vm.form.secondBillRate = 0;
      vm.form.secondBillDate = "";
      vm.form.thirdBillRate = 0;
      vm.form.thirdBillDate = "";
      vm.form.forthBillRate = 0;
      vm.form.forthBillDate = "";
      vm.form.fifthBillRate = 0;
      vm.form.fifthBillDate = "";
      vm.form.archived = 0;

      vm.submitForm = function () {
        console.log('addform form is in scope', vm.form);

        var toPush = {
          projectCode: vm.form.projectCode,
          client: (vm.form.client),
          projectName: (vm.form.projectName),
          aV: (vm.form.aV),
          crea: (vm.form.crea),
          tech: (vm.form.tech),
          redac: (vm.form.redac),
          other: (vm.form.other),
          projectManagement: (vm.form.projectManagement),
          deliveryDate: vm.form.deliveryDate?vm.form.deliveryDate.getTime():'',
          projectManager: (vm.form.projectManager),
          dirCli: (vm.form.dirCli),
          subContracting: (vm.form.subContracting),
          productionDate: vm.form.productionDate?vm.form.productionDate.getTime():'',
          totalAmount: (vm.form.totalAmount),
          comment: (vm.form.comment),
          firstBillRate: (vm.form.firstBillRate),
          firstBillDate: vm.form.firstBillDate?vm.form.firstBillDate.getTime():'',
          secondBillRate: vm.form.secondBillRate,
          secondBillDate: vm.form.secondBillDate?vm.form.secondBillDate.getTime():'',
          thirdBillRate: vm.form.thirdBillRate,
          thirdBillDate: vm.form.thirdBillDate?vm.form.thirdBillDate.getTime():'',
          forthBillRate: vm.form.forthBillRate,
          forthBillDate: vm.form.forthBillDate?vm.form.forthBillDate.getTime():'',
          fifthBillRate: vm.form.fifthBillRate,
          fifthBillDate: vm.form.fifthBillDate?vm.form.fifthBillDate.getTime():'',
          archived: vm.form.archived = 0
        };

        firebase.database().ref('projects/').push(toPush);

        $uibModalInstance.close(toPush);

        ref.on('child_added', function() {
          alert('Nouveau projet enregistré');
        });

      };
    }

    else {

      vm.form = {};
      vm.form.projectCode = row.projectCode?row.projectCode:'';
      vm.form.client = row.client?row.client:'';
      vm.form.projectName = row.projectName?row.projectName:'';
      vm.form.aV = row.aV?row.aV:0;
      vm.form.crea = row.crea?row.crea:0;
      vm.form.tech = row.tech?row.tech:0;
      vm.form.redac = row.redac?row.redac:0;
      vm.form.other = row.other?row.other:0;
      vm.form.projectManagement = row.projectManagement?row.projectManagement:0;
      vm.form.deliveryDate = row.deliveryDate?row.deliveryDate:'';
      vm.form.projectManager = row.projectManager?row.projectManager:'';
      vm.form.dirCli = row.dirCli?row.dirCli:'';
      vm.form.subContracting = row.subContracting?row.subContracting:'';
      vm.form.productionDate = row.productionDate?row.productionDate:'';
      vm.form.totalAmount = row.totalAmount?row.totalAmount:'';
      vm.form.comment = row.comment?row.comment:'';
      vm.form.firstBillRate = row.firstBillRate?row.firstBillRate:0;
      vm.form.firstBillDate = row.firstBillDate?row.firstBillDate:'';
      vm.form.secondBillRate = row.secondBillRate?row.secondBillRate:0;
      vm.form.secondBillDate = row.secondBillDate?row.secondBillDate:'';
      vm.form.thirdBillRate = row.thirdBillRate?row.thirdBillRate:0;
      vm.form.thirdBillDate = row.thirdBillDate?row.thirdBillDate:'';
      vm.form.forthBillRate = row.forthBillRate?row.forthBillRate:0;
      vm.form.forthBillDate = row.forthBillDate?row.forthBillDate:'';
      vm.form.fifthBillRate = row.fifthBillRate?row.fifthBillRate:0;
      vm.form.fifthBillDate = row.fifthBillDate?row.fifthBillDate:'';
console.log("la date qui sort", JSON.parse(row.deliveryDate))
      console.log("row", row.deliveryDate);

      vm.submitForm = function () {
        console.log('addform form is in scope', vm.form);

        var toPush = {
          projectCode: vm.form.projectCode,
          client: vm.form.client,
          projectName: vm.form.projectName,
          aV: vm.form.aV,
          crea: vm.form.crea,
          tech: vm.form.tech,
          redac: vm.form.redac,
          other: vm.form.other,
          projectManagement: vm.form.projectManagement,
          deliveryDate: vm.form.deliveryDate?vm.form.deliveryDate:vm.form.deliveryDate.getTime(),
          projectManager: (vm.form.projectManager),
          dirCli: (vm.form.dirCli),
          subContracting: (vm.form.subContracting),
          productionDate: vm.form.productionDate?vm.form.productionDate:vm.form.productionDate.getTime(),
          totalAmount: (vm.form.totalAmount),
          comment: (vm.form.comment),
          firstBillRate: (vm.form.firstBillRate),
          firstBillDate: vm.form.firstBillDate?vm.form.firstBillDate:vm.form.firstBillDate.getTime(),
          secondBillRate: vm.form.secondBillRate,
          secondBillDate: vm.form.secondBillDate?vm.form.secondBillDate:vm.form.secondBillDate.getTime(),
          thirdBillRate: vm.form.thirdBillRate,
          thirdBillDate: vm.form.thirdBillDate?vm.form.thirdBillDate:vm.form.thirdBillDate.getTime(),
          forthBillRate: vm.form.forthBillRate,
          forthBillDate: vm.form.forthBillDate?vm.form.forthBillDate:vm.form.forthBillDate.getTime(),
          fifthBillRate: vm.form.fifthBillRate
        };

        firebase.database().ref('projects/' + row.$id).update(toPush);
        $uibModalInstance.close(toPush);
      };
    }

    vm.cancel = function () {
      console.log('oaizueoaizue');
      $uibModalInstance.dismiss('cancel');
    };
  }


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
