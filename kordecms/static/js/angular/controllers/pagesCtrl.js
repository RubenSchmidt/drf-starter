/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('PagesCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', function ($scope, PageFactory, ArticleFactory, UserFactory) {
        PageFactory.list().then(function (response) {
            //Success
            console.log(response.data);
            $scope.pages = response.data;

        }, function (response) {
            //Error
            $scope.error = response.data;
        })
    }]);