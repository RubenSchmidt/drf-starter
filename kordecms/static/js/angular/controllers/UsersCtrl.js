/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('UsersCtrl',
    ['$scope', '$filter', 'SweetAlert', 'UserFactory', function ($scope, $filter, SweetAlert, UserFactory) {


        $scope.getRole = function (user) {
            if (user.is_superuser) {
                return "Admin";
            }
            else {
                return "Bruker";
            }
        }


         $scope.deleteUser = function (user) {
            //Show alert popup
            SweetAlert.swal({
                title: 'Vil du slette ' + user.username + '?',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nei',
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                   if(UserFactory.destroy(user.id)){
                       $scope.users = $filter('filter')($scope.users, {id: '!' + user.id});
                    }
                }
            });
        };
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