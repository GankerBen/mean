'use strict';

angular.module('mean.console').config(['$stateProvider', '$meanStateProvider',
    function ($stateProvider, $meanStateProvider) {
        $meanStateProvider
            .state('console', {
                url: '/console',
                templateUrl: 'console/views/index.html'
            })
            .state('console.application', {
                url: '/application',
                templateUrl: 'console/views/application.html'
            })
            .state('console.profile', {
                url: '/profile',
                templateUrl: 'console/views/profile.html'
            })
            .state('console.tab3', {
                url: '/tab3',
                templateUrl: 'console/views/tab3.html'
            })
            .state('console.tab4', {
                url: '/tab4',
                templateUrl: 'console/views/tab4.html'
            })
            .state('console.tab5', {
                url: '/tab5',
                templateUrl: 'console/views/tab5.html'
            });
    }
]);
