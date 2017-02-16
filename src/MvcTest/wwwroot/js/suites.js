(function () {
    'use strict';

    var app = angular.module('suites', ['ui.bootstrap']);

})();
(function () {
    'use strict';

    angular
        .module('suites')
        .controller('ConfirmDialogController', ConfirmDialogController);

    function ConfirmDialogController($uibModalInstance, options) {
        var self = this;

        self.title = options.title;
        self.content = options.content;
        self.cancelBtnText = options.cancelBtnText ? options.cancelBtnText : 'Cancel';
        self.acceptBtnText = options.acceptBtnText ? options.acceptBtnText : 'Accept';

        self.cancel = function () {
            $uibModalInstance.dismiss();
        }

        self.accept = function () {
            $uibModalInstance.close();
        }
    }
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

        self.addSuite = function () {
            var newSuite = {
                suiteId: -1,
                name: 'New Suite',
                models: []
            }

            var modal = $uibModal.open({
                controller: 'EditDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editSuiteDialog.html',
                resolve: {
                    suite: newSuite
                }
            });

            doApiActionAfterDialog(modal, function (result) {
                return $http.post('/api/Suites', result);
            });
        }

        self.editSuite = function (suite) {
            var modal = $uibModal.open({
                controller: 'EditDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editSuiteDialog.html',
                resolve: {
                    suite: suite
                }
            });

            doApiActionAfterDialog(modal, function (result) {
                return $http.put('/api/Suites/' + result.suiteId, result);
            });
        }

        self.deleteSuite = function (suite) {
            var modal = $uibModal.open({
                controller: 'ConfirmDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'confirmDialog.html',
                resolve: {
                    options: {
                            title: 'Confirm deletion',
                            content: 'Are you sure you want to delete suite ' + suite.name + '?',
                            cancelBtnText: 'Don\'t delete',
                            acceptBtnText: 'Delete'
                        }
                }
            });

            doApiActionAfterDialog(modal, function () {
                return $http.delete('/api/Suites/' + suite.suiteId);
            });
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

        function doApiActionAfterDialog(modalInstance, apiAction) {
            modalInstance.result
                .then(apiAction)
                .then(
                    function (apiResult) {
                        reload();
                    },
                    function (apiErrorResult) {
                        var msg = (apiErrorResult.data.errorMsg) ? apiErrorResult.data.errorMsg : "Unknown error (" + apiErrorResult.status + ")"
                        showErrorDialog(msg);
                    }
                );
        }
    }
})();