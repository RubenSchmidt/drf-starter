/**
 * Created by rubenschmidt on 24.02.2016.
 */

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