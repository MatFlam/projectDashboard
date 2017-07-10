  angular
      .module('minotaur')
      .controller('PlanningController', PlanningController)

    // .config(['weeklySchedulerLocaleServiceProvider', function(localeServiceProvider) {
    //   localeServiceProvider.configure({
    //     doys: {'es-es': 4},
    //     lang: {'es-es': {month: 'Mes', weekNb: 'número de la semana', addNew: 'Añadir'}},
    //     localeLocationPattern: '/vendor/angular-i18n/angular-locale_{{locale}}.js'
    //   });
    // }])


    /** @ngInject */
  function PlanningController($scope, $timeout, $log, $firebaseArray, $uibModal) {
    var planning = this;

    planning.lastSlotMeta = false;

    planning.model = {
        //locale: localeService.$locale.id,
      options: {/*monoSchedule: true*/},
      items: []
    };

    function serializingDate() {
      planning.model.items.forEach(function(item, itemIdx) {
        if(planning.model.items[itemIdx].schedules) {
          Object.keys(planning.model.items[itemIdx].schedules).forEach(function(scheduleTypeIdx) {
            planning.model.items[itemIdx].schedules[scheduleTypeIdx].forEach(function(schedule, scheduleIdx) {
              planning.model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].start = schedule.start.toJSON()
              planning.model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].end = schedule.end.toJSON()
            });
          })
        }
      });
    }

    function unserializingDate() {
      planning.model.items.forEach(function(item, itemIdx) {
        if(planning.model.items[itemIdx].schedules) {
          Object.keys(planning.model.items[itemIdx].schedules).forEach(function(scheduleTypeIdx) {
            planning.model.items[itemIdx].schedules[scheduleTypeIdx].forEach(function(schedule, scheduleIdx) {
              planning.model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].start = new Date(schedule.start)
              planning.model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].end = new Date(schedule.end)
            });
          })
        }
      })
    }

    function normalizeSchedule() {
      planning.model.items.forEach(function(item, idx) {
        if(!item.schedules) {
          planning.model.items[idx].schedules = {
            predicted: [],
            realised: []
          }
        }
        if(!item.schedules.predicted) {
          planning.model.items[idx].schedules.predicted = []
        }
        if(!item.schedules.realised) {
          planning.model.items[idx].schedules.realised = []
        }
      })
      unserializingDate();
    }


    var rootRef = firebase.database().ref();
    var ref = rootRef.child('users');

    planning.model.items = $firebaseArray(ref);

    planning.model.items.$loaded().then(function() {
      normalizeSchedule();
    })


    planning.onSlotAdded = function(cb) {


      if(planning.lastSlotMeta) {
        cb(planning.lastSlotMeta);
        return;
      }

      var modalInstance = $uibModal.open({
        templateUrl: 'app/newapp_pages/planning/modals/addSlot/addSlotModal.html',
        controller: 'AddSlotModalsController',
        controllerAs: 'modal',
        resolve: {}
      });

      modalInstance.result.then(function(data) {
        console.log('modal closed')
        planning.lastSlotMeta = data
        cb(data);
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    planning.getSlotText = function(schedule) {
      return schedule.meta.project + ' (' + schedule.meta.client + ')'
    }

    planning.onChange = function(itemIndex, scheduleIndex, scheduleValue) {
      serializingDate();
      planning.model.items.$save(itemIndex)
            .then(function(ref) {
              normalizeSchedule();
              console.log('Saved', planning.model.items[itemIndex])
            });
    };

    planning.shouldMergeTwoSlots = function(slot1, slot2) {
      return slot1.meta.project === slot2.meta.project && slot1.meta.client === slot2.meta.client
    }

    planning.onLocaleChange = function() {
      $log.debug('The locale is changing to', planning.model.locale);
      localeService.set(planning.model.locale).then(function($locale) {
        $log.debug('The locale changed to', $locale.id);
      });
    };
  }

