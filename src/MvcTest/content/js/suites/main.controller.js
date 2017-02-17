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
                controller: 'EditSuiteDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editSuiteDialog.html',
                resolve: {
                    editItem: newSuite
                }
            });

            doApiActionAfterDialog(modal, function (newSuite) {
                return $http.post('/api/Suites', newSuite);
            });
        }

        self.addModel = function (parentSuiteId) {
            var newModel = {
                modelId: -1,
                name: 'New Model'
            }

            var modal = $uibModal.open({
                controller: 'EditModelDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editModelDialog.html',
                resolve: {
                    editItem: newModel
                }
            });

            doApiActionAfterDialog(modal, function (newModelDetails) {
                var newModel = newModelDetails.editedModel;
                return $http.post('/api/Suites/' + parentSuiteId + '/Models', newModel);
            });
        }

        self.editSuite = function (suite) {
            var modal = $uibModal.open({
                controller: 'EditSuiteDialogController',
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
                controller: 'EditModelDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editModelDialog.html',
                resolve: {
                    editItem: model
                }
            });

            doApiActionAfterDialog(modal, function (editedModelDetails) {
                var editedModel = editedModelDetails.editedModel;

                var fd = new FormData();
                fd.append('model', JSON.stringify(editedModel));
                fd.append('logoFile', editedModelDetails.logoFile);

                return $http.put(
                    '/api/Suites/' + parentSuiteId + '/Models/' + editedModel.modelId,
                    fd,
                    {
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity
                    });
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

        self.modelLogoSource = function (suiteId, model) {
            //Add the logo nonce as a random query string so we force reload
            return '/api/Suites/' + suiteId + '/Models/' + model.modelId + '/logo' + '?r=' + model.logoNonce;
        }

        reload();

        function reload() {
            $http.get('/api/Suites')
                .then(function (response) {
                    self.suites = response.data;

                    //Refresh all models' logo nonces so that the images are reloaded every time the suites are reloaded
                    for (var suiteIdx = 0; suiteIdx < self.suites.length; suiteIdx++) {
                        var suite = self.suites[suiteIdx];
                        for (var modelIdx = 0; modelIdx < suite.models.length; modelIdx++) {
                            suite.models[modelIdx].logoNonce = Math.round(Math.random() * 999999);
                        }
                    }
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