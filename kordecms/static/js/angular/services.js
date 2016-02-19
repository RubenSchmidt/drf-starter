/**
 * Created by rubenschmidt on 16.02.2016.
 */

kordeCms.factory('PageFactory',
    ['$http', function ($http) {
        var endpoint = '/pages';
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
            return $http.delete('/pages/' + id)
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