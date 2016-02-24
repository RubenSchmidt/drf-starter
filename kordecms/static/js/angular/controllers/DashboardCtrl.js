/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('DashboardCtrl',
    ['$scope', 'ArticleFactory', 'PageFactory', function ($scope, ArticleFactory, PageFactory) {

        // Retrieves the number of published and unpublished articles
        ArticleFactory.count().then(function success(response) {
            var data = response.data;
            $scope.articles = {};
            $scope.articles.published = data.article_count_p;
            $scope.articles.unpublished = data.article_count_u;
        }, function error() {
            console.log('Something went wrong!');
        });

        PageFactory.list().then(function success(response) {
            $scope.pages = response.data;
            console.log($scope.pages);
        }, function error(response) {
            $scope.error = response.data;
        });

        $scope.editorMode = true;
    }]);