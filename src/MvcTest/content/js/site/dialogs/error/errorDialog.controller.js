(function () {
    'use strict';

    angular
        .module('common')
        .controller('ErrorDialogController', ErrorDialogController);

    function ErrorDialogController($uibModalInstance, errorMsg) {
        var self = this;

        self.errorMsg = errorMsg;

        self.dismiss = function () {
            $uibModalInstance.dismiss();
        }
    }
})();