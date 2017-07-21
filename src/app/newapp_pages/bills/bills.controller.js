(function () {
    'use strict';

    angular
        .module('minotaur')
        .controller('BillsController', BillsController)
        .controller('BillDatatableController', BillDatatableController);


    /** @ngInject */
    function BillsController() {

    }

    function BillDatatableController(DTOptionsBuilder, DTColumnBuilder, $resource, $scope, $q, $http) {

        var vm = this;
        vm.message = '';


        var getData = function () {
            var defer = $q.defer();

            var ref = firebase.database().ref('/projects/');

            ref.on('value', function(snap) {
                // snap.val() comes back as an object with keys
                // these keys need to be come "private" properties
                var data = snap.val();
                var dataWithKeys = Object.keys(data).map(function(key) {
                        var obj = data[key];
                obj._key = key;
                return obj;
            });

                console.log('dataWithKeys', dataWithKeys);

                defer.resolve(dataWithKeys);
            });

            /*firebase.database().ref('/projects/')
             .then(function (snapshot) {
             /*snapshot.forEach(function (childSnapshot) {

             var key = childSnapshot.key;

             var childData = childSnapshot.val();
             console.log(key);
             console.log(childData);
             vm.projects = childData;
             defer.resolve(vm.projects);
             });
             console.log('snapshot', snapshot)
             defer.resolve(snapshot);
             });*/
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
                {
                    extend: 'colvis',
                    //columnText: function ( dt, idx, title ) {
                    //    return (idx+1)+': '+title;
                    //},
                    text: "Selection des colonnes"
                }
                ,
                'copy',
                'print',
                'excel'
                // {
                //     text: 'Some button',
                //     key: '1',
                //     action: function (e, dt, node, config) {
                //         alert('Button activated');
                //     }
                // }
            ]);

        vm.dtColumns = [
            DTColumnBuilder.newColumn('dirCli').withTitle('Directeur clientèle').withOption('defaultContent', '').renderWith(function (data){return "<span>"+data+"</span>"}),
            DTColumnBuilder.newColumn('client').withTitle('Client').withOption('defaultContent', '').renderWith(function (data){return "<h5>"+data+"</h5>"}),
            DTColumnBuilder.newColumn('subContracting').withTitle('Sous-traitance').withOption('defaultContent', ''),
            DTColumnBuilder.newColumn('projectCode').withTitle('Code offre').withOption('defaultContent', '').renderWith(function (data){return "<h5>"+data+"</h5>"}),
            DTColumnBuilder.newColumn('productionDate').withTitle('Date prod').withOption('defaultContent', '').renderWith(function (data){return  "<h6>"+moment(data).format("DD MMMM")+"<br/><small>"+moment(data).format("YYYY")+"</small></h6>";}),
            DTColumnBuilder.newColumn('totalAmount').withTitle('Montant total').withOption('defaultContent', '').renderWith(function (data){return "<h6>"+data+" €</h6>"}),
            DTColumnBuilder.newColumn('commission').withTitle('Commission').withOption('defaultContent', '').renderWith(function (data){return "<h6>"+data+" %</h6>"}),
            DTColumnBuilder.newColumn('billingDate').withTitle('Date facturation').withOption('defaultContent', '').renderWith(function (data){return  "<h6>"+moment(data).format("DD MMMM")+"<br/><small>"+moment(data).format("YYYY")+"</small></h6>";}),
            DTColumnBuilder.newColumn('deliveryDate').withTitle('Date livraison').withOption('defaultContent', '').renderWith(function (data){return  "<h6>"+moment(data).format("DD MMMM")+"<br/><small>"+moment(data).format("YYYY")+"</small></h6>";})
        ];

        function someClickHandler(info) {
            vm.message = info.id + ' - ' + info.firstName;
        }

        vm.someClickHandler = someClickHandler;

    }


})();
