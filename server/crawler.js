const axios = require('axios');
const { JSDOM } = require('jsdom');

const Event = require('./Event/model');

const headers = {
  'content-type': 'application/json',
  'accept': 'application/json',
};

function crawler() {
  const date = Date.now();
  const url = 'https://www.visitstockholm.com/eventapi/gethtmleventlist/';
  const data = {
    Categories: [],
    DateFrom: date,
    Language: 'en',
    Limit: 50,
  };

  axios(url, {
    method: 'POST',
    headers,
    data,
  })
    .then(async res => {
      const dom = new JSDOM(res.data);
      let existsInDb = await Event.find({}, { createdBy: 1 });
      existsInDb = existsInDb.map(evt => evt.createdBy.id);

      const eventIds = getEventIds(dom)
        .filter(id => !existsInDb.includes(id))
        .map(id => getEvent(id));

      axios.all(eventIds)
        .then(eventData => eventData.map(event => parseEvent(event)))
        .then(eventData => saveToDatabase(eventData));

    })
    .catch(err => console.log(err));
}

function parseEvent({ html, id }) {
  const dom = new JSDOM(html);

  const qs = selector => dom.window.document.querySelector(selector) || {};
  const innerText = html => html.replace(/<.{1,5}>/gm, '').trim();

  const map = qs('.show-map');

  const [lat, lng] = map.outerHTML
    .split(/\s/)
    .filter(x => x.includes('data-l'))
    .map(x => x.split('=')[1]
    .replace(/[^\d.]/g, ''));

    console.log(lat, lng);

  const eventData = {
    createdBy: {  
      name: 'Stockholm Stad',
      id,
    },
    title: qs('.event-detail__heading').innerHTML,
    category: 'Stockholm',
    picture: 'https://www.visitstockholm.com' + qs('img.event-detail__img').src,
    date: {
      dateString: qs('.event-dates-list__item').innerHTML,
      start: null,
      end: null,
    },
    description: innerText(qs('.event-detail__description').innerHTML),
    location: {
      address: innerText(
        qs('[class*=address]')
          .querySelector('.event-detail__info--light').innerHTML
      ),
      zip: null,
      coordinates: {
        lng,
        lat,
      }
    },
    public: true,
  };

  return eventData;
}

function saveToDatabase(eventData) {
  Event.insertMany(eventData.map(evt => new Event(evt)));
}

function getEvent(id) {
  const url = 'https://www.visitstockholm.com/eventapi/getevent/';
  const data = {
    language: "en",
    dateFrom: Date.now(),
    id,
  };

  return axios(url, {
    method: 'POST',
    headers,
    data,
  }).then(res => ({
    html: res.data,
    id,
  })
  );
}

function getEventIds(dom) {
  const events = Array.from(
    dom.window.document.querySelectorAll('.event-list__item')
  );

  const eventIds = events
    .map(event => event.querySelector('.event-list-anchor').getAttribute('data-id'));

  return eventIds;
}
function getEventIds(dom) {
  const events = Array.from(
    dom.window.document.querySelectorAll('.event-list__item')
  );

  const eventIds = events
    .map(event => event.querySelector('.event-list-anchor').getAttribute('data-id'));

  return eventIds;
}
function getEventIds(dom) {
  const events = Array.from(
    dom.window.document.querySelectorAll('.event-list__item')
  );

  const eventIds = events
    .map(event => event.querySelector('.event-list-anchor').getAttribute('data-id'));

  return eventIds;
}

module.exports = crawler;
