﻿(function () {
    'use strict';

    angular
        .module('common')
        .service('DialogService', ['$uibModal', DialogService]);

    function DialogService($uibModal) {
        var self = this;

        self.showError = function (errorMsg) {
            $uibModal.open({
                controller: 'ErrorDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: '/templates/dialogs/error.html',
                resolve: {
                    errorMsg: function () { return errorMsg; }
                }
            });
        }
    }
})();