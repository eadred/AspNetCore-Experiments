(function () {
    'use strict';

    angular
        .module('common')
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