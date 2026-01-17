require('dotenv').config();

const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');

const { RedisStore } = require("connect-redis");
const redisClient = require('./config/redis');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;
const route = require('./routes/index');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

// 2. Cấu hình Session với Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 2
  }
}));

const hbs = exphbs.create({
  helpers: {
    eq: (a, b) => a === b,
    isActive: function (currentPath, ...paths) {
      paths = paths.slice(0, -1);
      if (typeof currentPath !== 'string') return '';
      return paths.some(path => typeof path === 'string' && currentPath.startsWith(path)) ? 'active' : '';
    },
    concat: (...args) => args.slice(0, -1).join(''),
    sum: (a, b) => a + b,
  },
  layoutsDir: path.join(__dirname, 'resources/views/layouts'),
  partialsDir: path.join(__dirname, 'resources/views/partials'),
  defaultLayout: 'user'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    next();
  });
}

app.use((req, res, next) => {
  req.io = io;
  next();
});

route(app);

app.use((req, res, next) => {
  res.status(404).render('error', {
    layout: 'public',
    message: 'Page not found'
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});