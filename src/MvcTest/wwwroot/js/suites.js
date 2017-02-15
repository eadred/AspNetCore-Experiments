(function () {
    'use strict';

    var app = angular.module('suites', []);

})();
(function () {
    'use strict';

    angular
        .module('suites')
        .controller('MainController', ['$http', MainController]);

    function MainController($http) {
        var self = this;

        self.suites = [];

        $http.get('/api/Suites')
          .then(function (response) {
              self.suites = response.data;
          });
    }

})();