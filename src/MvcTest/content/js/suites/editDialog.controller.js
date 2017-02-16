(function () {
    'use strict';

    angular
        .module('suites')
        .controller('EditDialogController', EditDialogController);

    function EditDialogController($uibModalInstance, suite) {
        var self = this;

        self.suite = copySuite(suite);

        self.cancel = function () {
            $uibModalInstance.dismiss();
        }

        self.save = function () {
            if (validate()) {
                $uibModalInstance.close(self.suite);
            }
        }

        validate();

        function copySuite(s) {
            var copy = s.constructor();
            copyProperties(s, copy);
            return copy;
        }

        function copyProperties(source, dest) {
            for (var attr in source) {
                if (source.hasOwnProperty(attr)) dest[attr] = source[attr];
            }
        }

        function validate() {
            if (self.suite.name == "") {
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