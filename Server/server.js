const express = require("express");
const app = express();
const {
  resolve
} = require("path");
const bodyParser = require('body-parser')
// Replace if using a different env file or config
const ENV_PATH = ".env";
const envPath = resolve(ENV_PATH);
const env = require("dotenv").config({
  path: envPath
});
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')

app.use(cors())


app.use(bodyParser.json())
app.use(express.static(process.env.STATIC_DIR));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});


/*
// Fetch the Checkout Session to display the JSON result on the success page
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

app.post("/create-checkout-session", async (req, res) => {
  const domainURL = process.env.DOMAIN;

  const { quantity } = req.body;
  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [payment_intent_data] - lets capture the payment later
  // [customer_email] - lets you prefill the email input in the form
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: "Pasha photo",
        quantity: quantity,
        currency: "usd",
        amount: 500 // Keep the amount on the server to prevent customers from manipulating on client
      }
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`
  });

  res.send({
    sessionId: session.id
  });
});
*/

app.get("/public-key", (req, res) => {
  res.send({
    publicKey: process.env.STRIPE_PUBLIC_KEY
  });
});


app.post("/customer", async (req, res) => {
  console.log('Customer EP Req body is %o', req.body)
  // Create a new customer and then a new charge for that customer:
  try {
    var customer = await stripe.customers
      .create({
        email: req.body.email
      })

    console.log("CUstomer is %o", customer.id)
    /*
      id: 'cus_Fo5Ut6pxwJVKDF',
      email: 'CHINTANSANGHVI5@GMAIL.COM',
      name: null,
    */
    var source = await stripe.customers.createSource(customer.id, {
      source: req.body.token
    })
    console.log("Source is %o", source.customer)
    var items = req.body.items.map(item => {
      console.log('Item title is %o', item)
      return stripe.charges.create({
        amount: req.body.total,
        currency: "usd",
        description: item.title,
        customer: source.customer,
        metadata:{title:item.title}
      })
    })
    var result = Promise.all(items)
    result.then(val => {
      console.log('Resulting Value is %o', val.length);
      var dataToSend = val.map(value => {
        console.log('Does it have metadata? %o', value.metadata)
        return {
          id: value.id,
          amount: value.amount,
          title: value.description,
          status:value.status
        }
      })
      console.log('Sending DAta Value is %o', dataToSend);
      res.json({
        status: 'succeeded',
        result: dataToSend
      });
    })
    /*
    var charge = await stripe.charges.create({
          amount: req.body.total,
          currency: "usd",
          description: req.body.items[0].description,
          customer: source.customer
        });
      console.log('Charge is %o', charge)
      */

  } catch (err) {
    res.status(500).end();
  }
});


app.post("/charge", async (req, res) => {
  console.log('Req body is %o', req.body)
  try {
    let {
      status
    } = await stripe.charges.create({
      amount: req.body.total,
      currency: "usd",
      description: req.body.item[0].description,
      source: req.body.token
    });
    console.log('status is %o', status)

    res.json({
      status
    });
  } catch (err) {
    res.status(500).end();
  }
});

// Webhook handler for asynchronous events.
app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);
  }

  res.sendStatus(200);
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
