const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

const crawler = require('./crawler');
const { mlabUri, jwtSecret } = require('./config');
const UserRoute = require('./User');
const EventRoute = require('./Event');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));

// Third party middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


mongoose.connect(mlabUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const conn = mongoose.connection;
conn.on('connected', async () => console.log(`MongoDb connected`));
conn.on('error', (err) => console.log(`error: ${err}`));

// Middleware
app.use((req, _, next) => {
  const cookie = req.cookies.chimera_cookie;
  const { method } = req;
  
  const decoded = jwt.decode(cookie, jwtSecret);
  const id = decoded && decoded.id;
  req.userId = id;
  
  console.log(`[${method.toUpperCase()}]: ${id} – ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/user', UserRoute);
app.use('/api/event', EventRoute);

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


// Crawler
crawler();
setInterval(() => crawler(), 1000 * 60 * 60 * 24);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
