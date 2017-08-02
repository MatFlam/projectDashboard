(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('AddSlotModalsController', AddSlotModalsController)


  /** @ngInject */
  function AddSlotModalsController($uibModalInstance, $firebaseArray) {
    var vm = this;

    var projects = this;

    projects.lastSlotMeta = false;

    projects.projectName = {
      //locale: localeService.$locale.id,
      options: {/*monoSchedule: true*/},
      items: []
    };

    var rootRef = firebase.database().ref();
    var ref = rootRef.child('projects');

    projects.projectName.items = $firebaseArray(ref.orderByChild('projectName'));
    console.log('coucou', projects.projectName.items);

    vm.submitForm = function() {
      $uibModalInstance.close({
        project: vm.form.project,
        client: vm.form.client
      });
    };
  }

})();
