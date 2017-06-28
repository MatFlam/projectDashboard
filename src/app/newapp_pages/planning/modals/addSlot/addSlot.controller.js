(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('AddSlotModalsController', AddSlotModalsController)


  /** @ngInject */
  function AddSlotModalsController($uibModalInstance) {
    var vm = this;

    vm.submitForm = function() {
      $uibModalInstance.close({
        project: vm.form.project,
        client: vm.form.client
      });
    };
  }

})();
