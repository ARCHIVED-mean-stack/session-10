angular.module('pirateDetail', []).component('pirateDetail', {
    templateUrl: '/templates/pirate-detail.html',

    controller: ['$http', '$routeParams', '$location',
        function PirateDetailController($http, $routeParams, $location) {
            var self = this;
            $http.get('/api/pirates/' + $routeParams.pirateId)
                .then(function (response) {
                    self.pirate = response.data;
                });

            self.back = function () {
                $location.path('/');
            }
        }
    ]
});