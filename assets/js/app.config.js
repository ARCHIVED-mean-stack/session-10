angular.module('pirateApp').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $routeProvider.
                when('/', {
                    template: '<pirates-view></pirates-view>'
                }).
                when('/pirates/:pirateId', {
                    template: '<pirate-detail></pirate-detail>'
                }).
                otherwise('/');
        }
    ]);