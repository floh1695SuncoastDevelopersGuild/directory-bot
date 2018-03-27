'use strict';

const APP_ID = '159041564812667';
const PAGE_ACCESS_TOKEN = 'EAACQpbZC5pXsBAGI6rsFrPiSnVVS9V0ZAr3BAAqn3Vk2wXtqc5KUGU6OZAxkZAyZAsNplgDgjUwe1TRgzzl71OwCiuZAJrjMaZBZB6WEUGNsuch7HTIDpDzXTnZA1YOzmRbOoXp9whNgRbQ1p179HY6MJHs0ZB6meAKDeG6UoNazZC4wgZDZD';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express().use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));

// Handles messages events
function handleMessage(sender_psid, received_message) {
  console.log('handleMessage');

  let response;

  console.log('GREP:ME:DUDES =>', {received_message});
  let payment = null;
  if (received_message.quick_replies) {
    const quick_replies = received_message.quick_replies;
    if (quick_replies.payload) {
      payment = quick_replies.payload;
    }
  }
  console.log('PAYMENT:CHECK:REAL', payment);

  // Check if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": "Red",
          "payload": "CHOOSE_RED"
          // "image_url": "http://example.com/img/red.png"
        },
        {
          "content_type": "text",
          "title": "Green",
          "payload": "CHOOSE_GREEN"
          // "image_url": "http://example.com/img/red.png"
        },
        {
          "content_type": "text",
          "title": "Blue",
          "payload": "CHOOSE_BLUE"
          // "image_url": "http://example.com/img/red.png"
        }
      ]
    }
  }

  // Sends the response message
  console.log('typeof psid', typeof (sender_psid));
  callSendAPI(parseInt(sender_psid), response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  console.log('handlePostback');
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  console.log('callSendAPI');
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  const _request = {
    "uri": "https://graph.facebook.com/v2.12/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }
  console.log(JSON.stringify(_request))
  console.log({ request_body });
  // Send the HTTP request to the Messenger Platform
  request(_request, (err, res, body) => {
    console.log({ err, body });
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });

}

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
  console.log('THISISABIGMESSAGEOYUCANSEEEASLY');

  let body = req.body;
  console.log('TAG:BODY:', body);

  // Checks this is an event from a page subscription
  if (body && body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {


      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

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

  let VERIFY_TOKEN = PAGE_ACCESS_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (token === VERIFY_TOKEN) { //mode === 'subscribe' && 

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      console.log(req.body);
      res.status(200).send(challenge);
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

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Start: Aaron
//END-GOAL: build logic to check send a message to someone available from the volunteerTable => contents: requestorPH#
// const twilio = require('twilio');
// var accountSid = 'ACbfa634639f4f4a70254ebda9c706d626'; // Your Account SID from www.twilio.com/console
// var authToken = process.env.TWILIO_TOKEN; // in .env from: Your Auth Token from www.twilio.com/console 
// var client = new twilio(accountSid, authToken);
// const sendSMS = () => {
//   ///using this for testing
//   let toPhoneNum = '+17274123303'
//   client.messages.create({
//     body: 'Hello World!',
//     to: toPhoneNum, // Text this number
//     from: '+18132134751' // From a valid Twilio number
//   })
//     .then((message) => console.log(message.sid));
// }
// app.get('/sms', (req, res) => {
//   sendSMS();
//   res.sendStatus(200);
// });
////2: store
////1: pull availablePerson
// End: Aaron
