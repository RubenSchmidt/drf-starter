/**
 * Created by rubenschmidt on 24.02.2016.
 */
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