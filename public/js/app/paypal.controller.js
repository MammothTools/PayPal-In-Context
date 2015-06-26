'use strict';

angular.module('PayPalInContext')
  .controller('paypalCtrl', function ($scope, $http, $location, paypalService) {
    $scope.paypalService = paypalService;
    $scope.queryParams = $location.search();
  });