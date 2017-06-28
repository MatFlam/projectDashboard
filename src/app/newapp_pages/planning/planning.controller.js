  angular
      .module('minotaur')

    .config(['weeklySchedulerLocaleServiceProvider', function(localeServiceProvider) {
      localeServiceProvider.configure({
        doys: {'es-es': 4},
        lang: {'es-es': {month: 'Mes', weekNb: 'número de la semana', addNew: 'Añadir'}},
        localeLocationPattern: '/vendor/angular-i18n/angular-locale_{{locale}}.js'
      });
    }])

      .controller('PlanningController', ['$scope', '$timeout', 'weeklySchedulerLocaleService', '$log', '$firebaseArray',
        function($scope, $timeout, localeService, $log, $firebaseArray) {
          var planning = this;

          planning.model = {
            locale: localeService.$locale.id,
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
            cb({
              project: 'Project X',
              client: 'Client Y'
            });
          }

          planning.getSlotText = function(schedule) {
            return 'azdazd'
          }

          planning.doSomething = function(itemIndex, scheduleIndex, scheduleValue) {
            serializingDate();
            planning.model.items.$save(itemIndex)
                .then(function(ref) {
                  normalizeSchedule();
                  console.log('Saved', planning.model.items[itemIndex])
                });
          };

          planning.onLocaleChange = function() {
            $log.debug('The locale is changing to', planning.model.locale);
            localeService.set(planning.model.locale).then(function($locale) {
              $log.debug('The locale changed to', $locale.id);
            });
          };
        }]);

