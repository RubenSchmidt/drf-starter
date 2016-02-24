/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('EditArticleCtrl',
    ['$scope', '$routeParams', 'PageFactory', 'ArticleFactory', 'SweetAlert', function ($scope, $routeParams, PageFactory, ArticleFactory, SweetAlert) {
        $scope.editorMode = true;
        $scope.newTagInput = {};
        $scope.article = {};
        // Initialize new element with default values
        initNewElement();
        var isNew = true;

        //Set default values for new element
        function initNewElement(){
            $scope.newElement = {
                'type': 1,
                'width_type':0,
                'hasImage': false
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
                $scope.newElement.article = $scope.article.id;
        }, function (response) {
            //Error
                console.log(response);
            });
        }

        $scope.pageHeader = function () {
            return isNew ? "Skriv en ny artikkel" : "Rediger artikkel";
        };

        $scope.addNewElement = function(){

            if($scope.newElement.type == 1){
                //We are adding a new text element
                ArticleFactory
                    .addNewElement($scope.newElement)
                    .then(function(response){
                    //Success
                    $scope.article.elements.push(response.data);
                }, function(response){
                    //Error
                    $scope.errors = response.data;
                });
            }else {
                console.log("ohter");
                //We are adding a new image element
                if(angular.isUndefined($scope.newElement.file)){
                    SweetAlert.swal({
                        title: 'Du må velge et bilde!',
                        showConfirmButton: true
                    });
                    return;
                }
                //Add a new element, with the file set.
                ArticleFactory
                    .addNewElement($scope.newElement, $scope.newElement.file)
                    .then(function(response){
                    //Success
                    $scope.article.elements.push(response.data);
                }, function(response){
                    //Error
                    $scope.errors = response.data;
                });
            }
        };


        $scope.setNewElementImage = function(file){
            $scope.newElement.file = file;
            console.log(file);
        };

        $scope.setNewElementType = function(type, width){
            //Type is either 0 or 1, if width is set, we are setting the width_type
            if(width){
                $scope.newElement.width_type = type;
            }else {
                $scope.newElement.type = type;
            }
        };

        $scope.saveArticle = function (file) {
            if (isNew) {
                createArticle();
            } else {
                console.log($scope.article);
                ArticleFactory.update($scope.article, file).then(function (response) {
                    //Success
                }, function (response) {
                    console.log(response);
                    SweetAlert.swal({
                        title: "Noe gikk galt!"
                    })
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
                    $scope.errors = response.data;
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
    }]);