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
