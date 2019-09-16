## Brief Overview

### High level flow
This application is simple ecommerce app that demonstrates how to use Stripe payments for checkout

![Checkout Flow](https://i.imgur.com/UAE8pdi.png)


### Features
* Add shopping cart andremove items from the cart
* Payment page with Credit Card option
* Checkout flow through Stripe
* Confirmation page

### Application Tech Stack:
* Front-end
> 1. React for front end shopping cart pages
> 2. Redux for managing state of shopping cart items
> 3. react-stripe-elements for supporting stripe CardElement
* Back-end
> 1. Express Node JS webserver
> 2. Stripe for supporting payments

The application tokenzies users' credit card leveraging Stripe's API `/v1/token endpoint`. Once the credit card is tokenzied, it sent to the application server along with user's email. App Server will then create a customer record within Stripe by passing information relevant to the customer, along with the token: `/v1/customers`. Once customer record is created, we then invoke the `/v1/customers/:id/source endpoint ti associated the credit card token with the customer. 
Finally, our App Client sends a list` of charge items, which we then loop through to send the charge to Stripe using the `/v1/charges` endoint. 

This application has been written with NodeJs Express backend for the thorough documentation on Stripe for Node language & Stripe.js javascript client.


### Some things to consider for enhancing the application:
- **Identity:** 

...We need to improve our user Identity collection. Allowing users to login through a preferred Identity service such as Google, Facebook, Twitter etc and use that as an account on the platform Or Alternately, create an account on the platform.
We need to introduce a database & a caching layer to account for storing user identity. The user identity should then be mapped to customer id from Stripe. 

- **Security:**

...We need to protect all NodeJS Express server API routes such that client connects to the backend server only through HTTPS. In some instances, we should protect specific routes behind user's identity such that its only available to user browser through a bearer token that can be generated by app server once we establish user identity on the backend

- **Additional Payment methods**

...We should consider adding support for additional payment methods. The Payment Request Button Element lets us collect payment and address information from  customers using Apple Pay and the Payment Request API.

- **Support for Full checkout**
Support dynamic Taxes & Shipping

- **Support for 3rd party integration with CRM or ERP**

...In order to track purchases through to our ERP, we should consider using webhooks from Stripe to then plug into a ERP or CRM

- **After Payment**

- Support for Failed payments

...From Stripe docs: 
>Handle the API error returned when a payment fails. For blocked and card issuer-declined payments, the error includes the charge’s ID, which you can then use to retrieve the charge
>Make use of webhooks to listen for event notifications. When a payment fails, the charge.failed event is triggered, containing the Charge object

- Retries

- Email receipts upon payments

- Handle webhook support for disputes

- Refunds



### Resources
- https://stripe.com/docs/recipes/elements-react
- https://github.com/stripe/react-stripe-elements#using-the-paymentrequestbuttonelement
- https://stripe.com/docs/charges#creating-charges
- https://www.npmjs.com/package/stripe
- https://stripe.com/docs
- https://stripe.com/docs/api/charges/object
- https://dashboard.stripe.com/test/payments?status%5B%5D=successful
- https://github.com/stripe-samples/checkout-one-time-payments
  
