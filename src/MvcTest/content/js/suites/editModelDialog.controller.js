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