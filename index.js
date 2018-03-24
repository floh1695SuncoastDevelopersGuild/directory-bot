'use strict';

const APP_ID = '159041564812667';
const PAGE_ACCESS_TOKEN = 'EAACQpbZC5pXsBAGH7uZCs9fXkZC3bEHv0atZCFeZBipCZCXYikWkQXyTPCCmUMTXcBKNLHdbvD6V4GZBtpFOmZABw0SvGpQ7yxqZCrpNyUjX9gZAeYmn0IZBs0jZByo1Xbg1WjnlHgSnTli9qAhWGZB5KQMsPYDUzHZC40YN1ih22Y7KnkIQZDZD';

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express().use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = PAGE_ACCESS_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(JSON.stringify(req));
      // res.status(200).send('CHALLANGED');
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.get('/hello', (req, res) => {
  // res.json({ hello: 'world' })
  res.send('<button>clickme</button>');
});

// Start: Aaron

//END-GOAL: build logic to check send a message to someone available from the volunteerTable => contents: requestorPH#
const twilio = require('twilio');
var accountSid = 'ACbfa634639f4f4a70254ebda9c706d626'; // Your Account SID from www.twilio.com/console
var authToken = 'your_auth_token'; // in .env from: Your Auth Token from www.twilio.com/console 

var client = new twilio(accountSid, authToken);

const sendSMS = () => {
    ///using this for testing
    let toPhoneNum = '+17274123303'

    client.messages.create({
    body: 'Hello World!',
    to: toPhoneNum, // Text this number
    from: '+18132134751' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

}

app.get('/sms', (req, res) => {
  sendSMS();
  res.sendStatus(200);
});

////2: store
////1: pull availablePerson


// End: Aaron

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
