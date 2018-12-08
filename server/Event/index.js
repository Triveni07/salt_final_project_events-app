const EventApi = require('./api');
const EventService = require('./services');

const router = EventApi(EventService);

module.exports = router;