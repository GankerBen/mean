'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
    function ($scope, $rootScope, Global, Menus) {
        $scope.global = Global;
        $scope.menus = {};

        console.log("$rootScope", $rootScope);
        console.log("Global", Global);
        console.log("$scope", $scope);

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
        queryMenu('main', defaultMainMenu);

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function () {

            console.log("on loggedin $rootScope.user", $rootScope.user);

            queryMenu('main', defaultMainMenu);

            $scope.global = {
                authenticated: !!$rootScope.user,
                user: $rootScope.user
            };
        });

    }
]);
