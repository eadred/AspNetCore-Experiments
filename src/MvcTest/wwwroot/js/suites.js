(function () {
    'use strict';

    var app = angular.module('suites', ['ui.bootstrap']);

})();
(function () {
    'use strict';

    angular
        .module('suites')
        .controller('EditDialogController', EditDialogController);

    function EditDialogController($uibModalInstance, suite) {
        var self = this;

        self.suite = copySuite(suite);

        self.cancel = function () {
            $uibModalInstance.dismiss();
        }

        self.save = function () {
            if (validate()) {
                $uibModalInstance.close(self.suite);
            }
        }

        validate();

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

        function validate() {
            if (self.suite.name == "") {
                self.errorDetails = {
                    hasError: true,
                    errorDescription: 'Name cannot be blank'
                }
                return false;
            } else {
                self.errorDetails = {
                    hasError: false
                }
                return true;
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('suites')
        .controller('ErrorDialogController', ErrorDialogController);

    function ErrorDialogController($uibModalInstance, errorMsg) {
        var self = this;

        self.errorMsg = errorMsg;

        self.dismiss = function () {
            $uibModalInstance.dismiss();
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('suites')
        .controller('MainController', ['$http', '$uibModal', MainController]);

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

            modal.result
                .then(
                    function (result) {
                        return $http.put('/api/Suites/' + result.suiteId, result);
                    })
                .then(
                    function (result) {
                        reload();
                    },
                    function (errorResult) {
                        var msg = (errorResult.data.errorMsg) ? errorResult.data.errorMsg : "Unknown error (" + errorResult.status + ")"
                        showErrorDialog(msg);
                    }
                );
        }

        reload();

        function reload() {
            $http.get('/api/Suites')
                .then(function (response) {
                    self.suites = response.data;
                });
        }

        function showErrorDialog(errorMsg) {
            $uibModal.open({
                controller: 'ErrorDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editError.html',
                resolve: {
                    errorMsg: function () { return errorMsg; }
                }
            });
        }
    }
})();