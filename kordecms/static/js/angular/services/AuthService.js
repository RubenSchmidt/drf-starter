/**
 * Created by rubenschmidt on 24.02.2016.
 */
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