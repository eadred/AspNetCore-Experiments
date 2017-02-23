describe('editSuiteDialog', function () {
    beforeEach(module('suites'));

    var controller;
    var uibModalInstance;
    var originalItem;
    var scopeApplied;

    function uibModalInstanceMock() {
        var self = this;

        self.dismissed = false;
        self.editResult = null;

        self.dismiss = function() {
            self.dismissed = true;
        }

        self.close = function(result) {
            self.editResult = result;
        }
    };

    beforeEach(inject(function(_$controller_) {
        uibModalInstance = new uibModalInstanceMock();
        originalItem = {
            name: "Test"
        };
        scopeApplied = false

        controller = _$controller_('EditModelDialogController', {
            $scope: { $apply: function () { scopeApplied = true; } },
            $uibModalInstance: uibModalInstance,
            editItem: originalItem
        });
    }));

    it('should make a copy of the item being edited', function() {
        expect(controller.editItem.name).toEqual(originalItem.name);
        controller.editItem.name = 'New name';
        expect(controller.editItem.name).not.toEqual(originalItem.name);
    });

    it('should be closed with the edit item on save', function() {
        controller.save();
        expect(uibModalInstance.editResult.editedModel).toBe(controller.editItem);
    });

    it('should be closed with the selected logo file on save', function() {
        var logo = whenALogoFileWithMimeTypeIsSelected('image/jpeg');
        controller.save();
        expect(uibModalInstance.editResult.logoFile).toBe(logo);
    });

    it('should allow the logo file to be cleared', function() {
        var logo = whenALogoFileWithMimeTypeIsSelected('image/jpeg');
        whenTheLogoFileIsCleared();
        controller.save();
        expect(uibModalInstance.editResult.logoFile).not.toBeDefined();
    });

    it('should update bindings when the logo file is selected', function () {
        whenALogoFileWithMimeTypeIsSelected('image/jpeg');
        expect(scopeApplied).toBe(true);
    });

    it('should update bindings when the logo file is cleared', function () {
        whenTheLogoFileIsCleared();
        expect(scopeApplied).toBe(true);
    });

    it('should not be closed on save if name left blank', function() {
        controller.editItem.name = '';
        controller.save();
        expect(uibModalInstance.editResult).toBe(null);
        expect(uibModalInstance.dismissed).toBe(false);
    });

    it('should set the error details if name left blank', function () {
        controller.editItem.name = '';
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasNameError: true,
            hasLogoError: false,
            nameErrorDescription: 'Name cannot be blank'
        });
    });

    it('should reset the error details once name is corrected', function () {
        controller.editItem.name = '';
        controller.save();
        controller.editItem.name = 'Valid name';
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasNameError: false,
            hasLogoError: false
        });
    });

    it('should not be closed on save if logo not an image', function () {
        whenALogoFileWithMimeTypeIsSelected('application/pdf');
        controller.save();
        expect(uibModalInstance.editResult).toBe(null);
        expect(uibModalInstance.dismissed).toBe(false);
    });

    it('should set the error details if logo not an image', function () {
        whenALogoFileWithMimeTypeIsSelected('application/pdf');
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasNameError: false,
            hasLogoError: true,
            logoErrorDescription: 'Logo must be an image'
        });
    });

    it('should reset the error details once logo is changed to an image', function () {
        whenALogoFileWithMimeTypeIsSelected('application/pdf');
        controller.save();
        whenALogoFileWithMimeTypeIsSelected('image/jpeg');
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasNameError: false,
            hasLogoError: false
        });
    });

    it('should reset the error details once logo is changed to any image type', function () {
        whenALogoFileWithMimeTypeIsSelected('application/pdf');
        controller.save();
        whenALogoFileWithMimeTypeIsSelected('image/anyoldvalue');
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasNameError: false,
            hasLogoError: false
        });
    });

    it('should reset the error details if logo is cleared', function () {
        whenALogoFileWithMimeTypeIsSelected('application/pdf');
        controller.save();
        whenTheLogoFileIsCleared();
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasNameError: false,
            hasLogoError: false
        });
    });

    it('should run validation as soon as an image is selected', function () {
        whenALogoFileWithMimeTypeIsSelected('application/pdf');
        //No need for save

        expect(controller.errorDetails).toEqual({
            hasNameError: false,
            hasLogoError: true,
            logoErrorDescription: 'Logo must be an image'
        });

        expect(scopeApplied).toBe(true); //Should be done so that validation errors show up immediately
    });

    it('should indicate when both the name and log are invalid', function () {
        controller.editItem.name = '';
        whenALogoFileWithMimeTypeIsSelected('application/pdf');
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasNameError: true,
            hasLogoError: true,
            nameErrorDescription: 'Name cannot be blank',
            logoErrorDescription: 'Logo must be an image'
        });
    });

    it('should be dismissed when cancelled', function () {
        controller.cancel();

        expect(uibModalInstance.editResult).toBe(null);
        expect(uibModalInstance.dismissed).toBe(true);
    });

    function whenALogoFileWithMimeTypeIsSelected(mimeType) {
        var file = { type: mimeType };
        controller.fileSelected([file]);
        return file;
    }

    function whenTheLogoFileIsCleared() {
        controller.fileSelected([]);
    }
});