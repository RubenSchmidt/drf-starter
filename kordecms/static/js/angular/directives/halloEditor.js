/**
 * Created by rubenschmidt on 24.02.2016.
 */
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