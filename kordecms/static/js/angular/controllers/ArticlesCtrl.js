/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('ArticlesCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', 'GlobalEditorService', function ($scope, PageFactory, ArticleFactory, UserFactory, GlobalEditorService) {
        $scope.editorMode = true;

        $scope.publishedText = function (article) {
            return article.isPublished ? "Publisert" : "Ikke publisert";
        }

        $scope.isTextElement = function (element) {
            return element.type == 1;
        }

        $scope.getColumnClass = function (element) {
            var classString = "";
            classString += (element.width_type == 1) ? "col-md-12" : "col-md-6";
            classString += (element.type == 1) ? " text-element" : " image-element";

            return classString;
        }

        ArticleFactory.list().then(function (response) {
            //Success
            $scope.articles = response.data;
            console.log(response.data);
        }, function (response) {
            //Error
        });
    }]);