(function () {
    'use strict';

    var app = angular.module('suites', ['ui.bootstrap']);

})();
(function () {
    'use strict';

    angular
        .module('suites')
        .controller('MainController', ['$http', '$uibModal', MainController])
        .controller('EditDialogController', EditDialogController);

    function MainController($http, $uibModal) {
        var self = this;

        self.suites = [];

        self.editSuite = function (suite) {
            var modal = $uibModal.open({
                controller: 'EditDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editSuiteDialog.html',
                resolve: {
                    suite: function () { return suite; }
                }
            });

            modal.result.then(
                function (result) {
                    console.log(result);
                });
        }

        reload();

        function reload() {
            $http.get('/api/Suites')
                .then(function (response) {
                    self.suites = response.data;
                });
        }
    }

    function EditDialogController($uibModalInstance, suite) {
        var self = this;

        var originalSuite = suite;
        self.suite = copySuite(suite);

        self.cancel = function () {
            $uibModalInstance.dismiss();
        }

        self.save = function () {
            copyProperties(self.suite, originalSuite);
            $uibModalInstance.close(originalSuite);
        }

        function copySuite(s) {
            var copy = s.constructor();
            copyProperties(s, copy);
            return copy;
        }

        function copyProperties(source, dest) {
            for (var attr in source) {
                if (source.hasOwnProperty(attr)) dest[attr] = source[attr];
            }
        }
    }

})();