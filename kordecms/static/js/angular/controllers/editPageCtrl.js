/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('EditPageCtrl',
    ['$scope', '$routeParams', 'PageFactory', 'Upload', function ($scope, $routeParams, PageFactory, Upload) {
        $scope.page = {};

        PageFactory.get($routeParams.pageSlug).then(function (response) {
            //Success
            $scope.page = response.data;
            PageFactory.listElements($scope.page.slug).then(function (response) {
                //Success
                $scope.pageElements = response.data;
            }, function (response) {
                //Error
                $scope.error = response.data;
            })
        }, function (response) {
            //Error
            $scope.error = response.data;
        });
    }]);
