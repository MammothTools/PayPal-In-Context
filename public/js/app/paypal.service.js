'use strict';

angular.module('PayPalInContext')
  .service('paypalService', function ($http) {

    function getToken(){
      $('#tokenSuccess').show();
      $('#tokenSuccessSpinner').show();
      var config = {
        "xsrfHeaderName": "X-CSRF-TOKEN",
        "xsrfCookieName": "XSRF-TOKEN"
      };
        $http.get('/paypal/oauth', config).
            success(function(response){
              $('#tokenSuccessSpinner').hide();
                paypal.tokenResponse = response;
                paypal.tokenSuccess = true;
              $('#tokenSuccessText').show();
              $('#genAuth').show();
            }).
            error(function(response){
                alert("Error " + response);
            });
    }

    function generateAuthRequest(){
      $('#genAuthRequest').show();
      $('#genAuthRequestSpinner').show();
      var config = {
        "xsrfHeaderName": "X-CSRF-TOKEN",
        "xsrfCookieName": "XSRF-TOKEN"
      };
        $http.get('/paypal/payment/authorize/request', config).
            success(function(response){
              $('#genAuthRequestSpinner').hide();
                paypal.authRequest = response;
              $('#genAuthRequestText').show();
              $('#auth').show();
            }).
            error(function(response){
                alert("Error " + response);
            });
    }


    function authorize(){
      $('#authRequest').show();
      $('#authRequestSpinner').show();
      var config = {
        "xsrfHeaderName": "X-CSRF-TOKEN",
        "xsrfCookieName": "XSRF-TOKEN"
      };
      $http.post('/paypal/payment/authorize/execute', paypal.authRequest, config).
            success(function(response){
              $('#authRequestSpinner').hide();
                paypal.authResponse = response;
                paypal.authSuccess = true;
              $('#authRequestText').show();
              $('#buttonArea').show();
            }).
            error(function(response){
                alert("Error " + response);
            });
    }

    function getDetails(paymentId){
      $('#getECResponse').show();
      $('#getECResponseSpinner').show();
      $http.get('/paypal/payment/getDetails/' + paymentId).
            success(function(response){
              $('#getECResponseSpinner').hide();
                paypal.getECResponse = response;
                paypal.paymentCsrf = response.csrf;
                paypal.getECResponseSuccess = true;
              $('#getECResponseText').show();
              $('#executePayment').show();
            }).
            error(function(response){
                console.log(response);
                alert("Error " + response);
            });
    }

    function executePayment(params){
      $('#executePaymentResponse').show();
      $('#executePaymentResponseSpinner').show();
      var config = {
        "xsrfHeaderName": "X-CSRF-TOKEN",
        "xsrfCookieName": "XSRF-TOKEN",
        "_csrf": paypal.paymentCsrf
      };
      var reqUrl = "/paypal/payment/execute/" + params.paymentId + "/" + params.PayerID;
      console.log(reqUrl);
      $http.post(reqUrl, config).
            success(function(response){
              $('#executePaymentResponseSpinner').hide();
                paypal.executePaymentResponse = response;
                paypal.executePaymentResponseSuccess = true;
              $('#executePaymentResponseText').show();
            }).
            error(function(response){
                console.log(response);
                alert("Error " + response);
            });
    }


    var paypal = {
      tokenResponse: {},
      authRequest: {},
      authResponse: {},
      getECResponse: {},
      executePaymentResponse: {},
      paymentCsrf: "",
      tokenSuccess: false,
      authSuccess: false,
      getECResponseSuccess: false,
      executePaymentResponseSuccess: false,
      authorize: function (paypal) { return authorize(paypal); },
      getToken: function (paypal) { return getToken(paypal); },
      generateAuthRequest: function (paypal) { return generateAuthRequest(paypal); },
      getDetails: function (paypal) { return getDetails(paypal); },
      executePayment: function (paypal) { return executePayment(paypal); }
    };

    return paypal;
  });