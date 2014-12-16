'use strict';

angular.module('mean.hls').controller('HlsController', ['$scope', 'Global', 'Hls',
  function($scope, Global, Hls) {
    $scope.global = Global;
    $scope.package = {
      name: 'hls'
    };
  }
]);
