/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('NavbarCtrl',
    ['$scope', '$location', '$route', 'AuthService', 'SweetAlert', function ($scope, $location, $route, AuthService, SweetAlert) {
        $scope.showNavbar = false;
        //Watch the route change, if we are at different page than login, show the navbar.
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.showNavbar = current.$$route.originalPath !== '/login';
        });

        $scope.logout = function () {
            //Show alert popup
            SweetAlert.swal({
                title: 'Vil du logge ut?',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nei',
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    AuthService.logout();
                    //Redirect to the loginpage
                    $location.path('/login');
                    $route.reload();
                }
            });
        }
    }]);
