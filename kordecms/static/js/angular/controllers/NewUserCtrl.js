/**
 * Created by rubenschmidt on 24.02.2016.
 */


kordeCms.controller('NewUserCtrl',
    ['$scope', '$location', 'UserFactory', function ($scope, $location, UserFactory) {

        $scope.saveUser = function () {
            createUser()
        };


        /*$scope.user.is_superuser = false;*/
        var createUser = function () {
            if ($scope.user){
                $scope.user.is_staff = true;
                UserFactory.create($scope.user).then(function (response) {
                    //Success
                    $location.path('/users')
                }, function (response) {
                    //error
                    $scope.errors = response.data;
                });
            }
            else{
                $scope.errors = {username: ["Dette feltet er påkrevd"], password: ["Dette feltet er påkrevd"]}
            }
        }
    }]);
