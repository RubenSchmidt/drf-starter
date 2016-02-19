/**
 * Created by rubenschmidt on 16.02.2016.
 */
var kordeCms = angular.module("kordeCms.api", ['ngCookies', 'ngResource']);

kordeCms.config(function($routeProvider) {
    $routeProvider
        .when('/admin', {
            controller: 'fileController',
            templateUrl: '/partials/file.html'
        })
        .otherwise({ redirectTo: '/' });
});

kordeCms.factory('PageFactory',
    ['$http', function ($http) {
        var endpoint = '/pages';
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

        function listElements(pageslug){
            return $http.get(endpoint+'/'+pageslug+'/'+'elements')
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
    ['$http', function ($http) {
        var endpoint = '/users';
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
    ['$http', function ($http) {
        var endpoint = '/articles';
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

kordeCms.directive('halloEditor', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }

            element.hallo({
               plugins: {
                 'halloformat': {"bold": true, "italic": true, "strikethrough": true, "underline": true},
                 'halloheadings': [1,2,3],
                 'hallojustify' : {}
               }
            });

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };
            element.on('hallodeactivated', function() {
                ngModel.$setViewValue(element.html());
                scope.$apply();
            });
        }
    };
});


kordeCms.controller('AdminCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', function($scope, PageFactory, ArticleFactory, UserFactory){


}]);