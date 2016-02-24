/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('LoginCtrl',
    ['$scope', '$location', 'AuthService', '$timeout', function ($scope, $location, AuthService, $timeout) {
        $scope.loading = false;
        $scope.login = function () {
            $scope.loading = true;
            AuthService.login($scope.username, $scope.password).then(function (response) {
                //Success
                $timeout(function () {
                    //Delay it 1 sec, so you can watch the beautiful loading indicator
                    $scope.loading = false;
                    $location.path('/');
                }, 1000);
            }, function (response) {
                //Error
                $scope.loading = false;
                $scope.errors = response.data;
            })
        }
    }]);
