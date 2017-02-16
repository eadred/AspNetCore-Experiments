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
                    editItem: newSuite
                }
            });

            doApiActionAfterDialog(modal, function (result) {
                return $http.post('/api/Suites', result);
            });
        }

        self.addModel = function (parentSuiteId) {
            var newModel = {
                modelId: -1,
                name: 'New Model'
            }

            var modal = $uibModal.open({
                controller: 'EditDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editModelDialog.html',
                resolve: {
                    editItem: newModel
                }
            });

            doApiActionAfterDialog(modal, function (result) {
                return $http.post('/api/Suites/' + parentSuiteId + '/Models', result);
            });
        }

        self.editSuite = function (suite) {
            var modal = $uibModal.open({
                controller: 'EditDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editSuiteDialog.html',
                resolve: {
                    editItem: suite
                }
            });

            doApiActionAfterDialog(modal, function (editedSuite) {
                return $http.put('/api/Suites/' + editedSuite.suiteId, editedSuite);
            });
        }

        self.editModel = function (parentSuiteId, model) {
            var modal = $uibModal.open({
                controller: 'EditDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editModelDialog.html',
                resolve: {
                    editItem: model
                }
            });

            doApiActionAfterDialog(modal, function (editedModel) {
                return $http.put('/api/Suites/' + parentSuiteId + '/Models/' + editedModel.modelId, editedModel);
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

        self.deleteModel = function (parentSuiteId, model) {
            var modal = $uibModal.open({
                controller: 'ConfirmDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'confirmDialog.html',
                resolve: {
                    options: {
                        title: 'Confirm deletion',
                        content: 'Are you sure you want to delete model ' + model.name + '?',
                        cancelBtnText: 'Don\'t delete',
                        acceptBtnText: 'Delete'
                    }
                }
            });

            doApiActionAfterDialog(modal, function () {
                return $http.delete('/api/Suites/' + parentSuiteId + '/Models/' + model.modelId);
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