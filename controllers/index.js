'use strict';

var paypal = require('paypal-rest-sdk');
var IndexModel = require('../models/index');
var ReturnModel = require('../models/return');
var CancelModel = require('../models/cancel');

module.exports = function (router) {

    var indexModel = new IndexModel();
    var cancelModel = new CancelModel();

    router.get('/', function (req, res) {
        res.render('index', indexModel);
    });

    router.get('/start', function (req, res){
    	res.cookie('XSRF-TOKEN', res.locals._csrf); //setting a cookie that is accessible by Angular
    	res.render('start', indexModel);
    });

    router.get('/return', function (req, res) {
        res.cookie('XSRF-TOKEN', res.locals._csrf); //setting a cookie that is accessible by Angular
        if(req.query){
        var returnModel = new ReturnModel(req.query);
        }
        res.render('return', returnModel);
    });

    router.get('/return#', function (req, res) {
        res.cookie('XSRF-TOKEN', res.locals._csrf); //setting a cookie that is accessible by Angular
        if(req.query){
        var returnModel = new ReturnModel(req.query);
        }
        res.render('return', returnModel);
    });

    router.get('/cancel', function (req, res) {
        res.cookie('XSRF-TOKEN', res.locals._csrf); //setting a cookie that is accessible by Angular
        res.render('cancel', cancelModel);
    });

    router.post('/checkout', function (req, res) {
        console.log(req.body.token);
        res.redirect(req.body.token);
    });

///////////////////////////////////////////////////////////
////////////////// APIs for Angular ///////////////////////
///////////////////////////////////////////////////////////

    router.get('/paypal/oauth', function (req, res) {
        paypal.generate_token( function(err, token) {
            if(err) {
                console.log('generate_token ERROR: ');
                console.log(err);
                res.json(err);
            } else {
                console.log('generate_token SUCCESS:');
                console.log(token);
                res.json(token);
            }
        });
    });

    router.get('/paypal/payment/authorize/request', function (req, res) {
        var payment_details = {};
        payment_details.intent = "authorize";
        payment_details.redirect_urls = {};
        payment_details.payer = {};
        payment_details.redirect_urls.return_url = "http://localhost:8000/return#"; //need to end with a '#' so angular can access the params
        payment_details.redirect_urls.cancel_url = "http://localhost:8000/cancel#"; //need to end with a '#' so angular can access the params
        payment_details.payer.payment_method = "paypal";
        payment_details.transactions = [];
        payment_details.transactions[0] = {};
        payment_details.transactions[0].amount = {};
        payment_details.transactions[0].amount.total = "10.00";
        payment_details.transactions[0].amount.currency = "USD";
        payment_details.transactions[0].description = "My Payment Description";

        console.log('----------------------------------------------------------');
        console.log('----------         PAYMENT_DETAILS OBJ          ----------');
        console.log('----------------------------------------------------------');
        console.log(payment_details);

        res.json(payment_details);

    });

    router.post('/paypal/payment/authorize/execute', function (req, res) {
        console.log('----------------------------------------------------------');
        console.log('----------         Auth Execute req.body        ----------');
        console.log('----------------------------------------------------------');
        console.log(req.body);
        paypal.payment.create(req.body, function (err, response) {
            if(err) {
                console.log('create payment ERROR: ');
                console.log(err);
                res.json(err);
            } else {
                console.log('create payment SUCCESS:');
                console.log(response);

                var url = response.links[1].href;
                var tmpAr = url.split('EC-');
                var token = "https://www.sandbox.paypal.com/checkoutnow?token=EC-" + tmpAr[1];
                console.log('------ Token Split ------');
                console.log(token);

                res.json(token);
            }
        });
    });

    router.post('/paypal/payment/execute/:paymentId/:payerId', function (req, res) {
        console.log('----------------------------------------------------------');
        console.log('----------         Execute req.params           ----------');
        console.log('----------------------------------------------------------');
        console.log(req.params);
        var execute_details = { "payer_id": req.params.payerId };
        paypal.payment.execute(req.params.paymentId, execute_details, function (err, response) {
            if(err) {
                console.log('execute payment ERROR: ');
                console.log(err);
                res.json(err);
            } else {
                console.log('execute payment SUCCESS:');
                console.log(response);
                res.json(response);
            }
        });
    });

    router.get('/paypal/payment/getDetails/:paymentId', function (req, res) {
        console.log('----------------------------------------------------------');
        console.log('----------    getDetails req.params.paymentId   ----------');
        console.log('----------------------------------------------------------');
        console.log(req.params.paymentId);
        paypal.payment.get(req.params.paymentId, function(error, payment){
          if(error !== null){
            console.log('ERROR');
            console.log(error);
            res.json(error);
          } else {
            payment.csrf = res.locals._csrf;
            console.log('SUCCESS');
            console.log(payment);
            res.json(payment);
          }
        });

    });


};


