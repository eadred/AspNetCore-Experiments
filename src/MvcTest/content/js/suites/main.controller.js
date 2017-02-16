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