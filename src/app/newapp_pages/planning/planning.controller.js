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


          var rootRef = firebase.database().ref();
          var ref = rootRef.child('users');

          planning.model.items = $firebaseArray(ref);

          planning.model.items.$loaded().then(function() {

            planning.model.items.forEach(function(item, idx) {
              console.log('idx', idx)
              if(!item.schedules) {
                planning.model.items[idx].schedules = {
                  predicted: [],
                  realised: []
                }
              }
              planning.model.items.$save(idx)
                .then(function(ref) {
                  console.log('planning.model.items saved')
                });
            })

            /*angular.forEach(planning.model.items, function(item) {
              if(!item.schedules) {
                item.schedules = {
                  predicted: [],
                  realised: []
                }
              }
            });*/
            //planning.model.items.$save(planning.model.items);
          })

          /*planning.model.items.$watch(function(){
            console.log("planning.model.items has changed")
          })*/

          /*ref.on('value', function(snap) {
            // var data = snap.val();
            planning.model.items = snap;

            angular.forEach(planning.model.items, function(item) {
              if(!item.schedule) {
                item.schedule = {
                  predicted: [],
                  realised: []
                }
              }
            });



            // var dataWithKeys = Object.keys(data).map(function(key) {
            //   var obj = data[key];
            //   obj._key = key;
            //   return obj;
            // });
            // planning.model.items = dataWithKeys.map(function(item) {
            //   if(!item.schedule) {
            //     item.schedule = {
            //       predicted: [],
            //       realised: []
            //     }
            //   }
            //   return item;
            // });
            $scope.$apply();
          })*/

          //planning.model.items = ref.$asArray();

          //planning.model.items.$bindTo($scope, planning.model.items)

          // ref.on('child_added', function(snap) {
          //   var user = snap.val();
          //   if(!user.label) {
          //     user.label = user.name;
          //   }
          //   if(!user.editable) {
          //     user.editable = true;
          //   }
          //   if(!user.schedules) {
          //     user.schedules = {
          //       predicted: [],
          //       realised: []
          //     };
          //   }
          //   //planning.model.items.$bindTo($scope, 'planning.model.items')
          //   $scope.$apply(function() {
          //     planning.model.items = planning.model.items.concat([user.schedule]);
          //   })
          // })

          planning.onSlotAdded = function(cb) {

            cb({
              project: 'Project X',
              client: 'Client Y'
            });
            /*console.log('onSlotAdded')
            return {
              project: 'ProjetX',
              client: 'ClientY'
            }*/
          }

          planning.getSlotText = function(schedule) {
            console.log('getSlotText', schedule)
            return 'azdazd'
          }

          planning.doSomething = function(itemIndex, scheduleIndex, scheduleValue) {
            planning.model.items.$save(itemIndex)
                .then(function(ref) {
                  console.log('planning.model.items saved')
                });
          };

          planning.onLocaleChange = function() {
            $log.debug('The locale is changing to', planning.model.locale);
            localeService.set(planning.model.locale).then(function($locale) {
              $log.debug('The locale changed to', $locale.id);
            });
          };
        }]);

