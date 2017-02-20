(function () {
    'use strict';

    var app = angular.module('suites', ['ui.bootstrap', 'common']);

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
        .controller('EditModelDialogController', EditModelDialogController);

    function EditModelDialogController($scope, $uibModalInstance, editItem) {
        var self = this;

        self.editItem = copyEditItem(editItem);

        self.cancel = function () {
            $uibModalInstance.dismiss();
        }

        self.save = function () {
            if (validate()) {
                $uibModalInstance.close({
                    editedModel :self.editItem,
                    logoFile: self.logoFile
                });
            }
        }

        self.fileSelected = function (files) {
            if (files.length > 0) {
                self.logoFile = files[0];
            } else {
                delete self.logoFile;
            }

            validate();

            //Because this method is called fro mplain vanilla onchange event handler
            //we need to tell ng to apply the changes
            $scope.$apply();
        }

        validate();

        function copyEditItem(item) {
            var copy = item.constructor();
            copyProperties(item, copy);
            return copy;
        }

        function copyProperties(source, dest) {
            for (var attr in source) {
                if (source.hasOwnProperty(attr)) dest[attr] = source[attr];
            }
        }

        function validate() {
            var valid = true;
            var errorDetails = {
                hasNameError: false,
                hasLogoError: false
            }

            if (self.editItem.name == "") {
                errorDetails.hasNameError = true;
                errorDetails.nameErrorDescription = 'Name cannot be blank';
                valid = false;
            }

            if (self.logoFile && !self.logoFile.type.match('image/.*')) {
                errorDetails.hasLogoError = true;
                errorDetails.logoErrorDescription = 'Logo must be an image';
                valid = false;
            }

            self.errorDetails = errorDetails;
            return valid;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('suites')
        .controller('EditSuiteDialogController', EditSuiteDialogController);

    function EditSuiteDialogController($uibModalInstance, editItem) {
        var self = this;

        self.editItem = copyEditItem(editItem);

        self.cancel = function () {
            $uibModalInstance.dismiss();
        }

        self.save = function () {
            if (validate()) {
                $uibModalInstance.close(self.editItem);
            }
        }

        validate();

        function copyEditItem(item) {
            var copy = item.constructor();
            copyProperties(item, copy);
            return copy;
        }

        function copyProperties(source, dest) {
            for (var attr in source) {
                if (source.hasOwnProperty(attr)) dest[attr] = source[attr];
            }
        }

        function validate() {
            if (self.editItem.name == "") {
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
        .controller('MainController', ['$http', '$uibModal', 'DialogService', MainController]);

    function MainController($http, $uibModal, DialogService) {
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
            addOrEditModel(
                parentSuiteId,
                {
                    modelId: -1,
                    name: 'New Model'
                },
                true);
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
            addOrEditModel(
                parentSuiteId,
                model,
                false);
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

        function addOrEditModel(parentSuiteId, model, isNew) {
            var url = '/api/Suites/' + parentSuiteId + '/Models';
            var method = 'POST'

            if (!isNew) {
                url = url + '/' + model.modelId;
                method = 'PUT'
            }

            var modal = $uibModal.open({
                controller: 'EditModelDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: 'editModelDialog.html',
                resolve: {
                    editItem: model
                }
            });

            doApiActionAfterDialog(modal, function (modelDetails) {
                var editedModel = modelDetails.editedModel;

                var fd = new FormData();
                fd.append('model', JSON.stringify(editedModel));
                fd.append('logoFile', modelDetails.logoFile);

                return $http({
                    method: method,
                    url: url,
                    data: fd,
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                });
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
                        //This failure callback will also be called when the dialog is dismissed without saving.
                        //apiErrorResult only gets set when we get an error back from the API call.
                        if (apiErrorResult) {
                            var msg = (apiErrorResult.data.errorMsg) ? apiErrorResult.data.errorMsg : "Unknown error (" + apiErrorResult.status + ")"
                            DialogService.showError(msg);
                        }
                    }
                );
        }
    }
})();