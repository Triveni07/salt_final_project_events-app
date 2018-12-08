const createRouter = require('./api');
const userService = require('./services');

const router = createRouter(userService);

module.exports = router;
