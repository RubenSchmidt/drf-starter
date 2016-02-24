/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('EditArticleCtrl',
    ['$scope', '$routeParams', 'PageFactory', 'ArticleFactory', 'UserFactory', 'GlobalEditorService', function ($scope, $routeParams, PageFactory, ArticleFactory, UserFactory, GlobalEditorService) {
        $scope.editorMode = true;
        $scope.newTagInput = {};
        $scope.article = {};
        var isNew = true;

        $scope.getColumnClass = function (element) {
            var classString = "";

            classString += (element.width_type == 1) ? "col-md-12" : "col-md-6";
            classString += (element.type == 1) ? " text-element" : " image-element";

            return classString;
        }

        if(!$routeParams.articleId){
            //Create new article object
            $scope.article = {
                title: "Tittel...",
                author_name: "Ole Nordviste",
                created_at: Date.now(),
                body_text: "Brødtekst...",
                isPublished: "Ikke publisert",
                thumbnail_image_src: "",
                elements: [],
                newElementType: 1,
                newElementWidth: 1,
            };
            isNew = true;
            console.log("New article mode");
        } else {
            //Get existing article
            ArticleFactory.get($routeParams.articleId).then(function (response) {
                //Success
                $scope.article = response.data;
                $scope.article.newElementType = 1;
                $scope.article.newElementWidth = 1;
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
            //Image
            if ($scope.article.newElementType == 0) {
                $scope.article.elements.push({
                        type: $scope.article.newElementType,
                        width_type: $scope.article.newElementWidth,
                    }
                );
            } // Text
            else if ($scope.article.newElementType == 1) {
                $scope.article.elements.push({
                        text: "Skriv inn teksten her...",
                        type: $scope.article.newElementType,
                        width_type: $scope.article.newElementWidth,
                    }
                );
            }
            //Reset menu
            $scope.article.newElementType = 1;
            $scope.article.newElementWidth = 1;
            $scope.showNewElementMenu = false;
        }

        $scope.saveArticle = function () {
            if (isNew) {
                createArticle();
            } else {
                ArticleFactory.update($scope.article).then(function (response) {
                    //Success
                }, function (response) {
                    console.log("Error in update article: " + response);
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