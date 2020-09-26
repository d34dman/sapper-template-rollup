import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';
import express from 'express';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const redis = require('redis');
const session = require('express-session');
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();

const getUser = req => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (token) {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
    }

    if (decoded) {
      return { username: decoded.username };
    }
  }
};



const app = express();
// Configures the express session.
app.use(session({
  store: new RedisStore({ client: redisClient }),
  cookie: {
    maxAge: 604800000,
  },
  secret: 'keyboard cat',
  resave: false,
  rolling: true,
  // saveUninitialized: false,
}));
app.use(express.json(), cookieParser(), (req, res, next) => {
  req.user = getUser(req);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Initiates Sapper and adds the session variable to the Store.
app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(
  sapper.middleware({
    // FIXME: Avoid the user variable too.
    session: (req, res) => ({user: req.user}),
  }),
);
app.listen(PORT, (err) => {
  if (err) console.log('error', err);
});

// Ref: https://socket.io/docs/
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(process.env.SAPPER_APP_SOCKET_IO_PORT, () => {
  console.log('Socket.io started port 4444');
});

io.on('connection', function (socket) {
  // Secret channel to pipe update message to other clients.
  socket.on(process.env.SOCKET_IO_BROADCAST_CHANNEL, function (data) {
    socket.broadcast.volatile.emit(data.channel, data.data);
  });
});
