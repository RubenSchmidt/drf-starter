/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.factory('GlobalEditorService',
    ['$rootScope', 'ArticleFactory', 'PageFactory', function ($rootScope, ArticleFactory, PageFactory) {
        return $rootScope.$on('rootScope:doneEditing', function (event, data) {
            switch (data.class_type) {
                case 'Article':
                    //Either article or image
                    ArticleFactory.update(data).then(function (response) {
                        //Success

                    }, function (response) {
                        //Error
                        console.log(response);
                    });
                    break;
                case 'PageElement':
                    if (data.type === 1) {
                        PageFactory.update(data).then(function (response) {
                            //Success

                        }, function (response) {
                            //Error
                            console.log(response);
                        })
                    }
            }
        });
    }]);