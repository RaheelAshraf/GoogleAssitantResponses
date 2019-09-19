'use strict';

const {
  dialogflow,
  SimpleResponse,
  Suggestions
} = require('actions-on-google');

const functions = require('firebase-functions');

const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new SimpleResponse({
    speech: `Here's an example of a simple response. ` +
      `Which type of response would you like to see next?`,
    text: `Here's a simple response. ` +
      `Which response would you like to see next?`,
  }));
});

app.intent('SSML', (conv) => {
  conv.ask(`<speak>` +
    `Here are <say-as interpet-as="characters">SSML</say-as> examples.` +
    `Here is a buzzing fly ` +
    `<audio src="https://actions.google.com/sounds/v1/animals/buzzing_fly.ogg"></audio>` +
    `and here's a short pause <break time="800ms"/>` +
    `</speak>`);
  conv.ask('Which response would you like to see next?');
});

exports.dialogflowWebhook = functions.https.onRequest(app);