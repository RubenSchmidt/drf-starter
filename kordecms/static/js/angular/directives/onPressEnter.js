/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.directive('onPressEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.onPressEnter);
                });
                event.preventDefault();
            }
        });
    };
});