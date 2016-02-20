/**
 * Created by rubenschmidt on 16.02.2016.
 */
var kordeCms = angular.module("kordeCms", ['ngCookies', 'ngRoute']);

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
                    'halloimage': {},
                    'halloreundo': {}
                }
            });

            console.log("kom inn");

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            element.on('hallodeactivated', function () {
                ngModel.$setViewValue(element.html());
                scope.$apply();
            });
        }
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

        $scope.pageImages = [];
        $scope.pageTexts = [];

        PageFactory.get($routeParams.pageSlug).then(function (response) {
            //Success
            $scope.page = response.data;

            PageFactory.listElements($scope.page.slug).then(function (response) {
                //Success
                $scope.pageElements = response.data;
                $scope.pageElements.forEach(function (element) {

                    if (element.type == 1) {
                        //Type text
                        //Add element to text elements
                        $scope.pageTexts.push(element);
                    } else if (element.type = 0) {
                        //Type image
                        $scope.pageImages.push(element);
                    }
                })

            }, function (response) {

            })

        }, function (response) {
            //Error
        })


    }]);

kordeCms.controller('DashboardCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', 'AuthService', function ($scope, PageFactory, ArticleFactory, UserFactory, AuthService) {

    }]);

kordeCms.controller('ArticlesCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', function ($scope, PageFactory, ArticleFactory, UserFactory) {
        ArticleFactory.list().then(function(response){
            //Success
            $scope.articles = response.data;

        }, function(response){
            //Error
        })

    }]);

kordeCms.controller('NavbarCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', function ($scope, PageFactory, ArticleFactory, UserFactory) {
        $scope.showNavbar = false;
        //Watch the route change, if we are at different page than login, show the navbar.
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.showNavbar = current.$$route.originalPath !== '/login';
        });
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