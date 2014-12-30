'use strict';

angular.module('mean.bukasystem').controller('BukasystemController', ['$scope', 'Global', 'Bukasystem',
  function($scope, Global, Bukasystem) {
    $scope.global = Global;
    $scope.package = {
      name: 'bukasystem'
    };
  }
]);
