/**
 * Created by rubenschmidt on 16.02.2016.
 */
var kordeCms = angular.module("kordeCms", ['ngCookies', 'ngRoute', 'ngSanitize', 'ngFileUpload']);

kordeCms.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: '/static/partials/dashboard.html'
        })
        .when('/articles/new/', {
            controller: 'EditArticleCtrl',
            templateUrl: '/static/partials/edit-article.html'
        })
        .when('/articles/:articleId', {
            controller: 'EditArticleCtrl',
            templateUrl: '/static/partials/edit-article.html'
        })
        .when('/users/:userId', {
            controller: 'EditUserCtrl',
            templateUrl: '/static/partials/edit-user.html'
        })
        .when('/users', {
            controller: 'UsersCtrl',
            templateUrl: '/static/partials/users.html'
        })
        .when('/articles', {
            controller: 'ArticlesCtrl',
            templateUrl: '/static/partials/articles.html'
        })
        .when('/pageelement/:id', {
            controller: 'PageElementCtrl',
            templateUrl: '/static/partials/page-element.html'
        })
        .when('/pages/:pageSlug/', {
            controller: 'EditPageCtrl',
            templateUrl: '/static/partials/edit-page.html'
        })
        .when('/pages', {
            controller: 'PagesCtrl',
            templateUrl: '/static/partials/pages.html'
        })
        .when('/login', {
            controller: 'LoginCtrl',
            templateUrl: '/static/partials/login.html'
        })
        .when('/new-user', {
            controller: 'NewUserCtrl',
            templateUrl: '/static/partials/new-user.html'
        })
        .otherwise('/login')
});
kordeCms.run(function ($rootScope, $location, $route, AuthService) {
    //Get the auth status of the user, if it goes trough we have a valid token.
    AuthService.getAuthStatus().then(function () {
        //Success
    }, function () {
        //Error, user is not authenticated
        $location.path('/login');
        $route.reload();
    });
});

kordeCms.value('apiUrl', '/api');


kordeCms.factory('PageElementFactory',
    ['$http', 'Upload', 'apiUrl', function ($http, Upload, apiUrl) {
        var endpoint = apiUrl + '/pageelements';

        return ({
            get: get,
            update: update,
            updateImageElement: updateImageElement
        });
        function get(id) {
            return $http.get(endpoint + '/' + id)
        }

        function update(element) {
            return $http.put(endpoint + '/' + element.id, element)
        }

        function updateImageElement(element, file) {
            return Upload.upload({
                url: endpoint + '/' + element.id,
                method: 'PUT',
                data: element,
                file: file
            });
        }
    }]);

kordeCms.factory('PageFactory',
    ['$http', 'Upload', 'apiUrl', function ($http, Upload, apiUrl) {
        var endpoint = apiUrl + '/pages';
        return ({
            get: get,
            list: list,
            listElements: listElements,
            create: create,
            update: update,
            updateImageElement: updateImageElement,
            destroy: destroy
        });

        function get(pageslug) {
            return $http.get(endpoint + '/' + pageslug)
        }

        function list() {
            return $http.get(endpoint)
        }

        function listElements(pageslug) {
            return $http.get(endpoint + '/' + pageslug + '/' + 'elements')
        }

        function create(user) {
            return $http.post(endpoint, user)
        }

        function update(pageslug, page) {
            return $http.put(endpoint + '/' + pageslug, page)
        }

        function updateImageElement(file, elementId, elementRow, pageId) {
            return Upload.upload({
                url: endpoint + '/elements/' + elementId,
                method: 'PUT',
                data: {id: elementId, type: 0, row: elementRow, page: pageId},
                file: file
            });
        }

        function destroy(pageslug) {
            return $http.delete('/pages/' + pageslug)
        }
    }]);
kordeCms.factory('UserFactory',
    ['$http', 'apiUrl', function ($http, apiUrl) {
        var endpoint = apiUrl + '/users';
        return ({
            get: get,
            list: list,
            create: create,
            update: update,
            destroy: destroy,
            currentUser: currentUser,
            updatePassword: updatePassword
        });

        function get(id) {
            return $http.get(endpoint + '/' + id)
        }

        function list() {
            return $http.get(endpoint)
        }

        function create(user) {
            return $http.post(endpoint, user)
        }

        function update(user) {
            return $http.put(endpoint + '/' + user.id, user)
        }
        function updatePassword(user){
            return $http.put(endpoint+'/'+ user.id, user)
        }

        function destroy(id) {
            return $http.delete(endpoint + '/' + id)
        }

        function currentUser(){
            return $http.get(endpoint+'/current-user')
        }
    }]);

kordeCms.factory('ArticleFactory',
    ['$http', 'apiUrl', function ($http, apiUrl) {
        var endpoint = apiUrl + '/articles';
        return ({
            get: get,
            list: list,
            create: create,
            update: update,
            destroy: destroy,
            count: count
        });
        function get(id) {
            return $http.get(endpoint + '/' + id)
        }

        function list() {
            return $http.get(endpoint)
        }

        function create(article) {
            return $http.post(endpoint, article)
        }

        function update(article) {
            return $http.put(endpoint + '/' + article.id, article)
        }

        function destroy(id) {
            return $http.delete(endpoint + '/' + id)
        }

        function count() {
            return $http.get(endpoint + '/count')
        }
    }]);


kordeCms.factory('SweetAlert', ['$timeout', '$window', function ($timeout, $window) {

    var swal = $window.swal;

    var self = function (arg1, arg2, arg3) {
        $timeout(function () {
            if (typeof(arg2) === 'function') {
                swal(arg1, function (isConfirm) {
                    $timeout(function () {
                        arg2(isConfirm);
                    });
                }, arg3);
            } else {
                swal(arg1, arg2, arg3);
            }
        });
    };

    //public methods
    var props = {
        swal: swal,
        adv: function (object) {
            $timeout(function () {
                swal(object);
            });
        },
        timed: function (title, message, type, time) {
            $timeout(function () {
                swal({
                    title: title,
                    text: message,
                    type: type,
                    timer: time
                });
            });
        },
        success: function (title, message) {
            $timeout(function () {
                swal(title, message, 'success');
            });
        },
        error: function (title, message) {
            $timeout(function () {
                swal(title, message, 'error');
            });
        },
        warning: function (title, message) {
            $timeout(function () {
                swal(title, message, 'warning');
            });
        },
        info: function (title, message) {
            $timeout(function () {
                swal(title, message, 'info');
            });
        }
    };

    angular.extend(self, props);

    return self;
}]);


kordeCms.factory('GlobalEditorService',
    ['$rootScope', 'ArticleFactory', 'PageFactory', function ($rootScope, ArticleFactory, PageFactory) {
        return $rootScope.$on('rootScope:doneEditing', function (event, data) {
            switch (data.class_type) {
                case 'Article':
                    //Either article or image
                    ArticleFactory.update(data).then(function (response) {
                        //Success

                    }, function (response) {
                        //Error
                        console.log(response);
                    });
                    break;
                case 'PageElement':
                    if (data.type === 1) {
                        PageFactory.update(data).then(function (response) {
                            //Success

                        }, function (response) {
                            //Error
                            console.log(response);
                        })
                    }
            }
        });
    }]);

kordeCms.factory('AuthService',
    ['$q', '$timeout', '$http', '$cookies',
        function ($q, $timeout, $http, $cookies) {

            // create user variable
            var user = null;

            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                getAuthStatus: getAuthStatus
            });

            function isLoggedIn() {
                //If user is defined return true
                return !!user;
            }

            function getUserStatus() {
                return user;
            }

            function getAuthStatus() {
                var deferred = $q.defer();

                if ($cookies.get('token')) {
                    $http.defaults.headers.common.Authorization = 'JWT ' + $cookies.get('token');
                    $http.post('/api/api-token-verify/', {'token': $cookies.get('token')}).then(function (response) {
                        //Handle success
                        //Usertoken went through and the user is authenticated
                        user = true;
                        deferred.resolve();
                    }, function (response) {
                        //Handle error
                        deferred.reject(response);
                    });
                } else {
                    deferred.reject('No token');
                }
                return deferred.promise;
            }

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/api/api-token-auth/', {username: username, password: password})

                    .then(function (response) {
                        // handle success
                        if (response.status === 200 && response.data.token) {
                            user = true;
                            $http.defaults.headers.common.Authorization = 'JWT ' + response.data.token;
                            $cookies.put('token', response.data.token);
                            deferred.resolve(response);

                        } else {
                            user = false;
                            deferred.reject(response);
                        }
                    }, function (response) {
                        //Handle error
                        user = false;
                        deferred.reject(response);
                    });
                // return promise object
                return deferred.promise;

            }

            function logout() {
                //Just remove the token from the header and the cookies
                user = false;
                delete $http.defaults.headers.common.Authorization;
                $cookies.remove('token');
            }
        }]);

kordeCms.directive('halloEditor', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }

            element.hallo({
                plugins: {
                    'halloformat': {"bold": true, "italic": true, "strikethrough": true, "underline": true},
                    'halloheadings': [1, 2, 3],
                    'hallojustify': {},
                    'hallolists': {},
                    'halloreundo': {}
                },
                toolbar: 'halloToolbarFixed'
            });

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            element.on('hallomodified', function () {
                ngModel.$setViewValue(element.html());
                scope.$apply();
            });

        }
    };
});

kordeCms.directive('kordeEditable', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            if (!scope.editorMode) {
                return;
            }
            if (!attrs.kordeModel) {
                return;
            }
            var kordeModelValue;

            scope.$watch(attrs.kordeModel, function (value) {
                kordeModelValue = value;
            });

            element.hallo({
                plugins: {
                    'halloformat': {"bold": true, "italic": true, "strikethrough": true, "underline": true},
                    'halloheadings': [1, 2, 3],
                    'hallojustify': {},
                    'hallolists': {},
                    'halloreundo': {}
                },
                toolbar: 'halloToolbarFixed'
            });

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            element.on('hallodeactivated', function () {
                ngModel.$setViewValue(element.html());
                scope.$apply();
                //Send the broadcast event
                $rootScope.$broadcast('rootScope:doneEditing', kordeModelValue);
            });

        }
    }
}]);

kordeCms.directive('onPressEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.onPressEnter);
                });
                event.preventDefault();
            }
        });
    };
});

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


kordeCms.controller('LoginCtrl',
    ['$scope', '$location', 'AuthService', '$timeout', function ($scope, $location, AuthService, $timeout) {
        $scope.loading = false;
        $scope.login = function () {
            $scope.loading = true;
            AuthService.login($scope.username, $scope.password).then(function (response) {
                //Success
                $timeout(function () {
                    //Delay it 1 sec, so you can watch the beautiful loading indicator
                    $scope.loading = false;
                    $location.path('/');
                }, 1000);
            }, function (response) {
                //Error
                $scope.loading = false;
                $scope.errors = response.data;
            })
        }
    }]);

kordeCms.controller('PageElementCtrl',
    ['$scope', '$routeParams', 'GlobalEditorService', 'PageElementFactory', 'SweetAlert', function ($scope, $routeParams, GlobalEditorService, PageElementFactory, SweetAlert) {
        $scope.editorMode = true;

        PageElementFactory.get($routeParams.id).then(function (response) {
            //Success
            $scope.element = response.data;
            console.log(response.data);
        }, function (response) {
            //Error
        });

        $scope.updateElement = function () {

            if ($scope.file) {
                // Uploads file
                upload($scope.file);
            } else {
                // Updates text
                PageElementFactory.update($scope.element).then(function success(response) {
                    SweetAlert.swal({title: "Lagret", type: "success", showConfirmButton: false, timer: 1000});
                }, function error(response) {
                    console.log(response);
                })
            }
        }

        $scope.setFile = function(file) {
            $scope.file = file;
        }

        // Function that checks the type of element
        $scope.checkType = function (check, answer) {
            return check === answer
        }

        var upload = function (file) {
            $scope.element.image_src = file;
            PageElementFactory.updateImageElement($scope.element, file).then(function (response) {
                console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
                SweetAlert.swal({title: "Lagret", type: "success", showConfirmButton: false, timer: 1000})
                $scope.element = response.data;
            }, function (response) {
                console.log('Error status: ' + response.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
    }]);


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

kordeCms.controller('EditUserCtrl',
    ['$scope', '$routeParams', '$location', '$http', 'UserFactory', function ($scope, $routeParams, $location, $http, UserFactory) {

        UserFactory.get($routeParams.userId).then(function (response) {
            //Success
            $scope.user = response.data;
        }, function (response) {
            //Error
        });

        UserFactory.currentUser($routeParams.userId).then(function (response) {
            //Success
            $scope.currentUser = response.data;
        }, function (response) {
            //Error
        });




        $scope.canEditUser = function(user){
            return (user.id == $scope.currentUser.id || $scope.currentUser.is_superuser)
        }

        var updateUser = function () {
            return (user.id != $scope.currentUser.id && $scope.currentUser.is_superuser)
        }


        $scope.updateUser = function() {
            updateUser()
            }

            var updateUser = function () {
                if ($scope.user) {
                    UserFactory.update($scope.user).then(function (response) {
                        //Success
                        $location.path('/users')
                    }, function (response) {
                        //error
                        $scope.errors = response.data;
                    });
                }
                else {
                    $scope.errors = {username: ["Dette feltet er påkrevd"], password: ["Dette feltet er påkrevd"]}
                }
            };



            $scope.password = {old_password: "", new_password_1: "", new_password_2: ""}

            $scope.updatePassword = function () {
                updatePassword()
            }


            var updatePassword = function () {
                if ($scope.password.new_password_1 == $scope.password.new_password_2) {
                    //New passwords match
                    $http.post('/api/api-token-auth/', {
                        username: $scope.user.username,
                        password: $scope.password.old_password
                    }).then(function (response) {
                        //Old password correct
                        if (response.status === 200 && response.data.token) {
                            $scope.user.password = $scope.password.new_password_2;
                            //Set new password to given new password
                            UserFactory.updatePassword($scope.user).then(function (response) {
                                //Success - password updated
                                $location.path('/users')
                            }, function (response) {
                                //error - could not set user password to given passord
                                $scope.errors = response.data;
                                console.log($scope.errors);
                            });
                        }
                    }, function (response) {
                        //Handle error
                        $scope.errors = response.data;
                        console.log(response.data);
                    });
                }
                else {
                    $scope.errors = {newPassword: ["Forskjellig passord oppgitt"]}
                }
            };

    }]);


kordeCms.controller('NewUserCtrl',
    ['$scope', '$location', 'UserFactory', function ($scope, $location, UserFactory) {

        $scope.saveUser = function () {
            createUser()
        };


        /*$scope.user.is_superuser = false;*/
        var createUser = function () {
            if ($scope.user){
                $scope.user.is_staff = true;
                UserFactory.create($scope.user).then(function (response) {
                    //Success
                    $location.path('/users')
                }, function (response) {
                    //error
                    $scope.errors = response.data;
                });
            }
            else{
                $scope.errors = {username: ["Dette feltet er påkrevd"], password: ["Dette feltet er påkrevd"]}
            }
        }
    }]);

