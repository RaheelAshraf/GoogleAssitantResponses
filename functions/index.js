'use strict';

const {
  dialogflow,
  SimpleResponse,
  Suggestions,
  Button,
  Image,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  LinkOutSuggestion,
  MediaObject
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
});

app.intent('BasicCard', (conv) => {
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`Here's an example of a basic card.`);
  conv.ask(new BasicCard({
    text: `This is a basic card.  Text in a basic card can include "quotes" and
    most other unicode characters including emojis.  Basic cards also support
    some markdown formatting like *emphasis* or _italics_, **strong** or
    __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other
    things like line  \nbreaks`, // Note the two spaces before '\n' required for
    // a line break to be rendered in the card.
    subtitle: 'This is a subtitle',
    title: 'Title: this is a title',
    buttons: new Button({
      title: 'This is a button',
      url: 'https://assistant.google.com/',
    }),
    image: new Image({
      url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
      alt: 'Image alternate text',
    }),
    display: 'CROPPED',
  }));
  conv.close('Which response would you like to see next?');
});


app.intent('BrowseCarousel', (conv) => {
  if (!conv.screen
    || !conv.surface.capabilities.has('actions.capability.WEB_BROWSER')) {
    conv.ask('Sorry, try this on a phone or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`Here's an example of a browsing carousel.`);
  conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'Title of item 1',
        url: 'https://example.com',
        description: 'Description of item 1',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
        footer: 'Item 1 footer',
      }),
      new BrowseCarouselItem({
        title: 'Title of item 2',
        url: 'https://example.com',
        description: 'Description of item 2',
        image: new Image({
          url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
          alt: 'Image alternate text',
        }),
        footer: 'Item 2 footer',
      }),
    ],
  }));

  conv.ask('These are suggestion chips.');
  conv.ask(new Suggestions('Suggestion 1'));
  conv.ask(new Suggestions(['Suggestion 2', 'Suggestion 3']));
  conv.ask(new LinkOutSuggestion({
    name: 'Suggestion Link',
    url: 'https://assistant.google.com/',
  }));
  conv.ask('Which type of response would you like to see next?');
});

app.intent('showMedia', (conv) => {
  if (!conv.surface.capabilities
    .has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
    conv.ask('Sorry, this device does not support audio playback.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask('This is a media response example.');
  conv.ask(new MediaObject({
    name: 'Jazz in Paris',
    url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
    description: 'A funky Jazz tune',
    icon: new Image({
      url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
      alt: 'Album cover of an ocean view',
    }),
  }));
  conv.ask(new Suggestions(['Basic Card', 'List',
    'Carousel', 'Browsing Carousel']));
});


exports.dialogflowWebhook = functions.https.onRequest(app);