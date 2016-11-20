angular.module('piratesView', []).component('piratesView', {
    templateUrl: '/templates/pirates-view.html',
    controller: function PirateAppController($scope, $http) {
        var self = this;
        $http.get('/api/pirates').
            then(function (response) {
                $scope.pirates = response.data;
            });

        $scope.deletePirate = function (index, pid) {
            $http.delete('/api/pirates/' + pid)
                .success(function () {
                    $scope.pirates.splice(index, 1);
                })
        };

        $scope.addPirate = function (pirate) {
            $http.post('/api/pirates/', pirate)
                .success(function () {
                    $scope.message = pirate.name;
                    $scope.pirates.push(pirate);
                    $scope.pirate = {}
                    $scope.addform.$setPristine();
                    $scope.addform.$setUntouched();

                })
        };

    }
});