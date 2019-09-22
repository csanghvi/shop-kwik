## Overview
This repository is a simple example of how to use Stripe APIs for collecting payments. The goal of this project is to demonstrate how easy it is to use a Stripe APIs and get setup for collecting payments on your ECommerce website. 
## Live Demo
 You can find a working demo of the app hosted on Heroku: [Demo](https://fast-retreat-49982.herokuapp.com/) 
 The demo is running in test mode – use `4242424242424242` as a test card number with any CVC + future expiration date.
 Since Heroku uses git to manage the builds, you should check out [this article](https://devcenter.heroku.com/articles/git) from Heroku as it covers everything you will need to know.
 Read more about testing on Stripe at  [https://stripe.com/docs/testing](https://stripe.com/docs/testing).
## Features
 -   Add & remove items from shopping cart
 -   Payment page with credit card option
 -   Checkout flow
 -   Confirmation page
## Application Tech Stack
This application has a web client that will be the store front end & a web server that will be responsible to process the payments by making Stripe API calls.  

Client side stack:
 - React client app bootstrapped by [create-react-app ]([https://create-react-app.dev/docs/getting-started](https://create-react-app.dev/docs/getting-started))
 - Redux, for managing state of shopping cart items
 - react-stripe-elements for creating payment form

Server side stack:
- Express Node JS webserver
- Stripe node SDK

## High level flow

1.	As we progress the user through the checkout pages, the first thing we need to do is get our Stripe publishable API key (pk_id). We could store the key using environment variable for REACT apps or get the pk_id from our server once user enters the checkout page.
2.	In order to collect payments from users on our e-commerce website we need to first create a payment form. Here we are going to make use of [Stripe Elements]([https://stripe.com/docs/recipes/elements-react](https://stripe.com/docs/recipes/elements-react)) to create a form that securely collects our customer’s card information without requiring us to handle sensitive card data. 
We then get the token as below: 
```javascript
let {token} = await this.props.stripe.createToken({name: "Name"});
```
3.	On the checkout page we are collecting users' email address as a mandatory field. This is only done for demonstration of how we can use Stripe's customer endpoint to first create a customer, and subsequently create charges. This email address along with credit card token and other details is sent to our app server. Our app server will then call Stripe's `/v1/customers`endpoint to create a customer record. Stripe will return a customer id if the customer record is created successfully. 
```javascript
    var customer = await stripe.customers.create({
        email: req.body.email
      })
```
4.	Once customer record is created, we then call the  `/v1/customers/:id/source` endpoint on Stripe to associated the credit card token with the customer id we received in the previous step. 
```javascript
    var source = await stripe.customers.createSource(customer.id, {
      source: req.body.token
    })
```
5.	Finally, we create charges against all items sent by our client to our server. We will use the  `/v1/charges`  API endpoint on Stripe for the same. We will use the metadata endpoint. Stripe supports adding [metadata](https://stripe.com/docs/api#metadata) to the most common requests you make, such as processing charges. Through metadata, you can associate other information—meaningful to you—with Stripe activity. 

```javascript
stripe.charges.create({
        amount: req.body.total,
        currency: 'usd',
        description: item.title,
        customer: source.customer,
        metadata: { title: item.title }
      })
```

6.	Upon receiving a success response from Stripe, our app server will send a confirmation of charges to our App client, which in turn will take the user to confirmation page and display the `ch_id (charge id)`

Below sequence diagram explains the flow. 
![Checkout Flow](https://i.imgur.com/UAE8pdi.png)

 
## Guidelines for development
### How to setup and run locally

You have two options to run the app locally
1. You can use a VPN tunnel, like ngrok, to link your local machine to an actual web address. This handy tool lets you set up a secure tunnel to your localhost, which is a fancy way of saying it opens access to your local app from the internet. You would use this option if you prefer to use HTTPS connections. 
2. You can simply run the client & server on the localhost. You may be limited to HTTP connections. 

This guide only focuses on option 2 above. 

#### Steps required in order to setup the app

1. Create a new file in the Server directory of the app called `.env`
```
STRIPE_PUBLIC_KEY=pk_id
STRIPE_SECRET_KEY=sk_id
STRIPE_WEBHOOK_SECRET=whsec_
DOMAIN=http://localhost:4242
STATIC_DIR=../Client/build/
```
2. Next install all app dependencies. To do that, using the terminal, navigate to the Client directory where the app is located and run `npm install`. You will do the same for Server directory. 
3. Finally, execute `npm run dev` from the root directory.

**Features:**

-   Localization in 14 different languages  🌍
-   Built-in Apple Pay support  🍎
-   Built-in dynamic 3D Secure (ready for SCA)  🔔
-   Plans to support more payment methods  🔮


Things to consider before getting ready for production:

 - [ ] Identity:
	 -  This sample demo does not capture and save users' identity related information. 
	 - In the future, if our application needs to support capturing user's identity related information, we can use federated identity through Google or Facebook Authentication. On our server we should consider introducing a database for persisting user's identity. We should save user's customer id as received from Stripe for creating new charges corresponding to the same user.
    
 - [ ] Security:
	 - We need to ensure all NodeJS Express server API endpoints are only accessible behind HTTPS. We must also consider protecting specific routes using jSON web token. 

 - [ ] Support for additional payment methods:
	 - The current iteration of our demo app only uses credit card payment option. Using Stripe APIs we can easily add support for additional payment methods. The [payment request button element](%5Bhttps://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement%5D%28https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement%29) lets us collect payment and address information from customers using Apple Pay and the Payment Request API.

 - [ ] Support for shipping & taxes:
	 - In order to demonstrate a full e-commerce solution our app should also support collecting users' address information & calculate shipping based off of that. We must consider using Avalara APIs or other 3rd party tax APIs to collect tax related information. It will be good to keep an eye out on Stripes' [roadmap relating to taxes](https://stripe.com/docs/billing/taxes) 

- [ ] After payment use cases
Please refer Stripe documentation for all scenarios one must consider post payment. 
	- Support for Failed payments
    - Handle retries
    - Support sending email receipts for payment confirmation
    - Handle use cases for disputes, refunds & chargebacks
    

## FAQ

Q: Why did you pick these frameworks?

A: The goal of this exercise is to demonstrate the key Stripe calls and concepts. I used the tech stack that is simple to understand & easy to implement.


## Resources

-   [https://stripe.com/docs/recipes/elements-react](https://stripe.com/docs/recipes/elements-react)
-   [https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement](https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement)
-   [https://stripe.com/docs/charges#creating-charges](https://stripe.com/docs/charges#creating-charges)
-   [https://stripe.com/docs](https://stripe.com/docs)
-   [https://stripe.com/docs/api/charges/object](https://stripe.com/docs/api/charges/object)
-   [https://dashboard.stripe.com/test/payments?status%5B%5D=successful](https://dashboard.stripe.com/test/payments?status%5B%5D=successful)
-   [https://github.com/stripe-samples/checkout-one-time-payments](https://github.com/stripe-samples/checkout-one-time-payments)
