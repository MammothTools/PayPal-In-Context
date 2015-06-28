# PayPalInContext

PayPal Express Checkout In-Context Example.

##The Easy Way:

```sh
$ git clone https://github.com/MammothTools/PayPal-In-Context.git
```

```sh
cd PayPal-In-Context
npm install
bower install
npm install -g nodemon
```

Go into `/index.js` and update the code below with your `client_id` and `client_secret` from the [PayPal Sandbox](https://developer.paypal.com):

```js
paypal.configure({
			  'mode': 'sandbox', //sandbox or live
			  'client_id': '<Your_Client_ID>',
			  'client_secret': '<Your_Client_Secret>',
              'grant_type': 'client_credentials',
              'content_type': 'application/x-www-form-urlencoded'
			});
```

Now go into `/public/templates/start.dust` and update the `merchant_id` with your [PayPal Sandbox](https://developer.paypal.com) account `merchant_id`:

```js
window.paypalCheckoutReady = function () { 
        paypal.checkout.setup('<Your_Merchant_ID>', {
        container: 'myContainer'
    }); 
};
```

Now go back to the command line and run the command:

```sh
nodemon server.js
```

## This Example is provided under the MIT License, see [LICENSE.md](https://github.com/MammothTools/PayPal-In-Context/blob/master/LICENSE.md) for details.
