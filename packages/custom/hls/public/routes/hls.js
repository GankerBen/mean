'use strict';

angular.module('mean.hls').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('hls example page', {
      url: '/hls/example',
      templateUrl: 'hls/views/index.html'
    });
  }
]);
