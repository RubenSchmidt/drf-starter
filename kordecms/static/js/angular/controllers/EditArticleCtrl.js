/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('EditArticleCtrl',
    ['$scope', '$routeParams', 'PageFactory', 'ArticleFactory', 'UserFactory', 'GlobalEditorService', function ($scope, $routeParams, PageFactory, ArticleFactory, UserFactory, GlobalEditorService) {
        $scope.editorMode = true;
        $scope.newTagInput = {};
        $scope.article = {};
        // Initialize new element with default values
        initNewElement();
        var isNew = true;

        //Set default values for new element
        function initNewElement(){
            $scope.newElement = {
                'type': 0,
                'width_type':0,
                'image_src': ''
            };
        }

        if(!$routeParams.articleId){
            //Create new article object
            isNew = true;
            console.log("New article mode");
        } else {
            //Get existing article
            ArticleFactory.get($routeParams.articleId).then(function (response) {
                //Success
                $scope.article = response.data;
                isNew = false;
                console.log(response.data);
        }, function (response) {
            //Error
                console.log(response);
            });
        }

        $scope.pageHeader = function () {
            return isNew ? "Skriv en ny artikkel" : "Rediger artikkel";
        };

        $scope.addArticleElement = function () {
            console.log($scope.newElement);
            $scope.article.elements.push(angular.copy($scope.newElement));
            //Reset element
            initNewElement();
        };

        $scope.saveArticle = function () {
            if (isNew) {
                createArticle();
            } else {
                ArticleFactory.update($scope.article).then(function (response) {
                    //Success
                }, function (response) {
                    console.log(response);
                });
            }
        };

        var createArticle = function () {
            if (!$scope.article.title) {
                //error
            } else if (!$scope.article.body) {
                //error
                console.log("Error in create article: " + response);
            } else {
                ArticleFactory.create($scope.article).then(function (response) {
                    //Success
                    $scope.article = {};

                }, function (response) {
                    //error
                    console.log(response);
                    $scope.errors;
                });
            }

        };

        //Vil vi lagre artikkelen hver gang en tag legges til eller slettes?
        $scope.addTag = function (article) {
            var list = article.tag_string.split(',');
            var id = article.id.toString();
            if (list.indexOf($scope.newTagInput[id]) < 0 && $scope.newTagInput[id]) {
                article.tag_string += article.tag_string.length > 0 ? "," + $scope.newTagInput[id] : $scope.newTagInput[id];
                $scope.newTagInput[id] = '';
                ArticleFactory.update(article).then(function (response) {
                    //Success
                }, function (response) {
                    //error
                    console.log(response);
                });
            }
        };

        $scope.deleteTag = function (tag_name, article) {
            var list = article.tag_string.split(',');
            var index = list.indexOf(tag_name);
            if (index > -1) {
                list.splice(index, 1);
            }
            article.tag_string = list.join()
            ArticleFactory.update(article).then(function (response) {
                //Success
            }, function (response) {
                //error
                console.log(response);
            });
        }

        $scope.upload = function (file) {
            $scope.article.thumbnail_image_src = file.name;
            console.log(file);
        };

    }]);