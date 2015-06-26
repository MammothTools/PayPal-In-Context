'use strict';

//set the startSymbol and endSymbol to [[]], respectively so it doesn't conflict with Dust.

angular.module('PayPalInContext', ['ngSanitize', 'ngRoute'])
.config(function ($interpolateProvider) {
    $interpolateProvider
        .startSymbol("[[");
    $interpolateProvider
        .endSymbol("]]");
  });