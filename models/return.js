'use strict';


module.exports = function ReturnModel(params) {
    if(params.paymentId){
        var paymentId = params.paymentId;
    } else { var paymentId = ""; }
    if(params.token){
        var token = params.token;
    } else { var token = ""; }
    if(params.PayerID){
        var payerId = params.PayerID;
    } else { var payerId = ""; }
    var jsonParams = {
        "paymentId": paymentId,
        "token": token,
        "payerId": payerId
    };
    return {
        name: 'return',
        title: 'PayPal Return',
        params: jsonParams
    };
};
