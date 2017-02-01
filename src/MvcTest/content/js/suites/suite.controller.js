(function () {
    'use strict';

    angular
        .module('suites')
        .controller('SuiteController', ['$scope', SuiteController]);

    function SuiteController($scope) {
        var self = this;

        self.suite = $scope.$parent.suite;
    }

})();