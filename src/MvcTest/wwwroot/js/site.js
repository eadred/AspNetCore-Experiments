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