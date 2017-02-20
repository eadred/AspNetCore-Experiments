(function () {
    'use strict';

    var app = angular.module('common', ['ui.bootstrap']);

})();
(function () {
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

        self.showConfirmation = function (options) {
            return $uibModal.open({
                controller: 'ConfirmDialogController',
                controllerAs: 'dlgCtrl',
                templateUrl: '/templates/dialogs/confirm.html',
                resolve: {
                    options: options
                }
            });
        }
    }
})();
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