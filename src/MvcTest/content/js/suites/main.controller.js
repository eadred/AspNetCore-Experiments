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

        self.deleteSuite = function (suite) {
            var modal = $uibModal.open({
                controller: 'ConfirmDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'confirmDialog.html',
                resolve: {
                    options: function () {
                        return {
                            title: 'Confirm deletion',
                            content: 'Are you sure you want to delete suite ' + suite.name + '?',
                            cancelBtnText: 'Don\'t delete',
                            acceptBtnText: 'Delete'
                        }; }
                }
            });

            modal.result
                .then(
                    function () {
                        return $http.delete('/api/Suites/' + suite.suiteId);
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