(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($translate) {
    var vm = this;
    vm.changeLanguage = function (langKey) {
      $translate.use(langKey);
      vm.currentLanguage = langKey;
    };
    vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
    vm.headerStyle = 'header-gradient-gray';
    vm.primaryColor = 'primary-color-gray';
    vm.navigationStyle = 'navigation-dark';
  }
})();
