/**
 * Created by rubenschmidt on 16.02.2016.
 */
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