'use strict';

angular.module('mean.system')
    .controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus','$http',
        function ($scope, $rootScope, Global, Menus, $http) {
            $scope.global = Global;
            $scope.menus = {};
            $scope.root = $rootScope;

            // Default hard coded menu items for main menu
            var defaultMainMenu = [];

            // Query menus added by modules. Only returns menus that user is allowed to see.
            function queryMenu(name, defaultMenu) {

                Menus.query({
                    name: name,
                    defaultMenu: defaultMenu
                }, function (menu) {
                    $scope.menus[name] = menu;
                });
            }

            // Query server for menus and check permissions
//            queryMenu('main', defaultMainMenu);

            $scope.isCollapsed = false;

            $rootScope.$on('loggedin', function () {

                console.log('loggedin');
                console.log('$rootScope.user', $rootScope.user);
                //queryMenu('main', defaultMainMenu);

                $scope.global = {
                    authenticated: !!$rootScope.user,
                    user: $rootScope.user
                };
            });
        }
    ]);
