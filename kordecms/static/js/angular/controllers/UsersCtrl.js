/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('UsersCtrl',
    ['$scope', '$filter', 'UserFactory', function ($scope, $filter, UserFactory) {


        $scope.getRole = function (user) {
            if (user.is_superuser) {
                return "Admin";
            }
            else {
                return "Bruker";
            }
        }

        $scope.deleteUser = function (userId) {
            if(UserFactory.destroy(userId)){
            $scope.users = $filter('filter')($scope.users, {id: '!' + userId});
            }
            else{
                //error - could not delete user
            }
        }
        $scope.canEditUser = function(user){
            return (user.id == $scope.currentUser.id || $scope.currentUser.is_superuser)
        }

        $scope.canDeleteUser = function(user){
            return (user.id != $scope.currentUser.id && $scope.currentUser.is_superuser)
        }

        UserFactory.currentUser().then(function success (response) {
            $scope.currentUser = response.data;
        }, function(response) {
            //Error
        });

        UserFactory.list().then(function (response) {
            //Success
            $scope.users = response.data;
        }, function (response) {
            //Error
        });


    }]);