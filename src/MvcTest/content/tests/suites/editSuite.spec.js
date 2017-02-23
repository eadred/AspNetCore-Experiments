describe('editSuiteDialog', function () {
    beforeEach(module('suites'));

    var controller;
    var uibModalInstance;
    var originalItem;

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

        controller = _$controller_('EditSuiteDialogController', { $uibModalInstance: uibModalInstance, editItem: originalItem });
    }));

    it('should make a copy of the item being edited', function() {
        expect(controller.editItem.name).toEqual(originalItem.name);
        controller.editItem.name = 'New name';
        expect(controller.editItem.name).not.toEqual(originalItem.name);
    });

    it('should be closed with the edit item on save', function() {
        controller.save();
        expect(uibModalInstance.editResult).toBe(controller.editItem);
    });

    it('should not be closed on save if name left blank', function() {
        controller.editItem.name = '';
        controller.save();
        expect(uibModalInstance.editResult).toBe(null);
    });

    it('should set the error details if name left blank', function () {
        controller.editItem.name = '';
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasError: true,
            errorDescription: 'Name cannot be blank'
        });
    });

    it('should reset the error details once name is corrected', function () {
        controller.editItem.name = '';
        controller.save();
        controller.editItem.name = 'Valid name';
        controller.save();

        expect(controller.errorDetails).toEqual({
            hasError: false
        });
    });

    it('should be dismissed when cancelled', function () {
        controller.cancel();

        expect(uibModalInstance.editResult).toBe(null);
        expect(uibModalInstance.dismissed).toBe(true);
    });
});