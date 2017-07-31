angular
    .module('minotaur')
    .controller('PlanningController', PlanningController);

// .config(['weeklySchedulerLocaleServiceProvider', function(localeServiceProvider) {
//   localeServiceProvider.configure({
//     doys: {'es-es': 4},
//     lang: {'es-es': {month: 'Mes', weekNb: 'número de la semana', addNew: 'Añadir'}},
//     localeLocationPattern: '/vendor/angular-i18n/angular-locale_{{locale}}.js'
//   });
// }])


/** @ngInject */
function PlanningController($scope, $timeout, $log, $firebaseArray, $uibModal, lodash) {
    var planning = this;

    planning.lastSlotMeta = false;

    planning.model = {
        //locale: localeService.$locale.id,
        options: {/*monoSchedule: true*/},
        items: []
    };
    planning.localModel = {
        //locale: localeService.$locale.id,
        options: {/*monoSchedule: true*/},
        items: []
    };

    function serializingDate(model) {
        model.items.forEach(function (item, itemIdx) {
            if (model.items[itemIdx].schedules) {
                Object.keys(model.items[itemIdx].schedules).forEach(function (scheduleTypeIdx) {
                    model.items[itemIdx].schedules[scheduleTypeIdx].forEach(function (schedule, scheduleIdx) {
                        model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].start = schedule.start ? JSON.stringify(schedule.start) : "";
                        model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].end = schedule.end ? JSON.stringify(schedule.end) : "";
                    });
                });
            }
        });
        return model;
    }

    function unserializingDate(model) {
        model.items.forEach(function (item, itemIdx) {
            if (model.items[itemIdx].schedules) {
                Object.keys(model.items[itemIdx].schedules).forEach(function (scheduleTypeIdx) {
                    model.items[itemIdx].schedules[scheduleTypeIdx].forEach(function (schedule, scheduleIdx) {
                        model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].start = schedule.start ? JSON.parse(schedule.start) : "";
                        model.items[itemIdx].schedules[scheduleTypeIdx][scheduleIdx].end = schedule.end ? JSON.parse(schedule.end) : "";
                    });
                });
            }
        });
        return model;
    }


    function normalizeSchedule(model) {
        model.items.forEach(function (item, idx) {
            // item.editable = false;
            if (!item.schedules) {
                model.items[idx].schedules = {
                    predicted: [],
                    realised: []
                };
            }
            if (!item.schedules.predicted) {
                model.items[idx].schedules.predicted = [];
            }
            if (!item.schedules.realised) {
                model.items[idx].schedules.realised = [];
            }
        });
        console.log("Model.items", model.items)
        return unserializingDate(model);
    }


    var rootRef = firebase.database().ref();
    var ref = rootRef.child('/users');

    planning.model.items = $firebaseArray(ref);
    console.log("model", planning.model)

    planning.model.items.$loaded().then(function () {
        planning.localModel = lodash.clone(planning.model);
        normalizeSchedule(planning.localModel);
    });


    planning.onSlotAdded = function (cb) {


        if (planning.lastSlotMeta) {
            cb(planning.lastSlotMeta);
            return;
        }

        var modalInstance = $uibModal.open({
            templateUrl: 'app/newapp_pages/planning/modals/addSlot/addSlotModal.html',
            controller: 'AddSlotModalsController',
            controllerAs: 'modal',
            resolve: {}
        });

        modalInstance.result.then(function (data) {
            console.log('modal closed')
            planning.lastSlotMeta = data
            cb(data);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    planning.getSlotText = function (schedule) {
        return schedule.meta.project + ' (' + schedule.meta.client + ')'
    };

    planning.onChange = function (itemIndex, scheduleIndex, scheduleValue) {
        console.log("itemIndex", itemIndex, "model.items", planning.localModel.items)
    };

    planning.onDelete = function (itemIndex, scheduleIndex, scheduleValue) {
        console.log("itemIndex", itemIndex, "scheduleIndex", scheduleIndex, "ScheduleValue", scheduleValue)
    };

    planning.shouldMergeTwoSlots = function (slot1, slot2) {
        // return slot1.meta.project === slot2.meta.project && slot1.meta.client === slot2.meta.client
        return;
    };

    planning.onLocaleChange = function () {
        $log.debug('The locale is changing to', planning.localModel.locale);
        localeService.set(planning.localModel.locale).then(function ($locale) {
            $log.debug('The locale changed to', $locale.id);
        });
    };

    planning.saveLocalItems = function () {
        console.log("click", planning.model.items);

        planning.model = serializingDate(planning.localModel)
        lodash.each(planning.localModel.items, function (user, idx) {

            planning.model.items.$save(planning.localModel.items.indexOf(user))
                .then(function (ref) {
                    $log.info('Saved', planning.model.items[idx])
                });
        });
        normalizeSchedule(planning.localModel);

        var rootRef = firebase.database().ref();
        var ref = rootRef.child('/users');

        planning.model.items = $firebaseArray(ref);

        planning.model.items.$loaded().then(function () {
            planning.localModel = lodash.clone(planning.model);
            normalizeSchedule(planning.localModel);
        });

    }
}

