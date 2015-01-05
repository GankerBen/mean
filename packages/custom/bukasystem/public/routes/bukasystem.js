'use strict';

angular.module('mean.bukasystem').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('product', {
                url: '/product',
                templateUrl: 'bukasystem/views/product.html'
            })
            .state('case', {
                url: '/case',
                templateUrl: 'bukasystem/views/case.html'
            })
            .state('price', {
                url: '/price',
                templateUrl: 'bukasystem/views/price.html'
            })
            .state('docs', {
                url: '/docs',
                templateUrl: 'bukasystem/views/docs.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'bukasystem/views/about.html'
            })
            .state('bukalogin', {
                url: '/login',
                templateUrl: 'bukasystem/views/bukalogin.html'
            })
            .state('bukaregister', {
                url: '/register',
                templateUrl: 'bukasystem/views/bukaregister.html'
            });
    }
]);
