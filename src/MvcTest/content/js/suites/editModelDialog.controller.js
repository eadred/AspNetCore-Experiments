(function () {
    'use strict';

    angular
        .module('suites')
        .controller('EditModelDialogController', EditModelDialogController);

    function EditModelDialogController($uibModalInstance, editItem) {
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