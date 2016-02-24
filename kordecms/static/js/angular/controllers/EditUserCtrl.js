/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('EditUserCtrl',
    ['$scope', '$routeParams', '$location', '$http', 'UserFactory', function ($scope, $routeParams, $location, $http, UserFactory) {

        UserFactory.get($routeParams.userId).then(function (response) {
            //Success
            $scope.user = response.data;
        }, function (response) {
            //Error
        });

        UserFactory.currentUser($routeParams.userId).then(function (response) {
            //Success
            $scope.currentUser = response.data;
        }, function (response) {
            //Error
        });




        $scope.canEditUser = function(user){
            return (user.id == $scope.currentUser.id || $scope.currentUser.is_superuser)
        }

        var updateUser = function () {
            return (user.id != $scope.currentUser.id && $scope.currentUser.is_superuser)
        }


        $scope.updateUser = function() {
            updateUser()
            }

            var updateUser = function () {
                if ($scope.user) {
                    UserFactory.update($scope.user).then(function (response) {
                        //Success
                        $location.path('/users')
                    }, function (response) {
                        //error
                        $scope.errors = response.data;
                    });
                }
                else {
                    $scope.errors = {username: ["Dette feltet er påkrevd"], password: ["Dette feltet er påkrevd"]}
                }
            };



            $scope.password = {old_password: "", new_password_1: "", new_password_2: ""}

            $scope.updatePassword = function () {
                updatePassword()
            }


            var updatePassword = function () {
                if ($scope.password.new_password_1 == $scope.password.new_password_2) {
                    //New passwords match
                    $http.post('/api/api-token-auth/', {
                        username: $scope.user.username,
                        password: $scope.password.old_password
                    }).then(function (response) {
                        //Old password correct
                        if (response.status === 200 && response.data.token) {
                            $scope.user.password = $scope.password.new_password_2;
                            //Set new password to given new password
                            UserFactory.updatePassword($scope.user).then(function (response) {
                                //Success - password updated
                                $location.path('/users')
                            }, function (response) {
                                //error - could not set user password to given passord
                                $scope.errors = response.data;
                                console.log($scope.errors);
                            });
                        }
                    }, function (response) {
                        //Handle error
                        $scope.errors = response.data;
                        console.log(response.data);
                    });
                }
                else {
                    $scope.errors = {newPassword: ["Forskjellig passord oppgitt"]}
                }
            };

    }]);
