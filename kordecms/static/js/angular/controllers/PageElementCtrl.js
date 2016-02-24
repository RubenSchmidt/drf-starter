/**
 * Created by rubenschmidt on 24.02.2016.
 */
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