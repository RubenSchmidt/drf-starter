/**
 * Created by rubenschmidt on 16.02.2016.
 */
var kordeCms = angular.module("kordeCms", ['ngCookies', 'ngRoute', 'ngSanitize']);

kordeCms.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: '/static/partials/dashboard.html'
        })
        .when('/articles', {
            controller: 'ArticlesCtrl',
            templateUrl: '/static/partials/articles.html'
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

kordeCms.factory('PageFactory',
    ['$http', 'apiUrl', function ($http, apiUrl) {
        var endpoint = apiUrl + '/pages';
        return ({
            get: get,
            list: list,
            listElements: listElements,
            create: create,
            update: update,
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
            destroy: destroy
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

        function destroy(id) {
            return $http.delete(endpoint + '/' + id)
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
            destroy: destroy
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
            if(event.which === 13) {
                scope.$apply(function (){
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
            $scope.pages = response.data;

        }, function (response) {
            //Error
            $scope.error = response.data;
        })
    }]);

kordeCms.controller('EditPageCtrl',
    ['$scope', '$routeParams', 'PageFactory', 'ArticleFactory', 'UserFactory', function ($scope, $routeParams, PageFactory, ArticleFactory, UserFactory) {
        $scope.showEditorModal = false;
        $scope.pageImages = [];
        $scope.pageTexts = [];

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

        $scope.openEditorModal = function (element) {
            $scope.activeElement = element;
            $scope.showEditorModal = true;
        };

        $scope.closeEditorModal = function () {
            $scope.showEditorModal = false;
        }

    }]);

kordeCms.controller('DashboardCtrl',
    ['$scope', 'GlobalEditorService', function ($scope, GlobalEditorService) {
        $scope.editorMode = true;
        $scope.test = 'Hei på deg';
    }]);

kordeCms.controller('ArticlesCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', 'GlobalEditorService', function ($scope, PageFactory, ArticleFactory, UserFactory, GlobalEditorService) {
        $scope.editorMode = true;
        $scope.newTagInput = {};

        $scope.articleHasTags = function(article){
            return article.tag_string.length > 0;
        }

        ArticleFactory.list().then(function (response) {
            //Success
            $scope.articles = response.data;
            console.log(response.data);
        }, function (response) {
            //Error
        });
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