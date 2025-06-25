const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const http = require('http'); // Add http module
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIO(server);
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const port = 3000;
const route = require('./routes/index');

require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(session({
  secret: 'x7k9mPqW3zT2rY8nJ5vL0bF6tH', // Replace with a secure key
  resave: false,
  saveUninitialized: false
}));
const hbs = exphbs.create({
   helpers: {
        eq: (a, b) => a === b, // Register the 'eq' helper
        // isActive: (currentPath, path) => currentPath.startsWith(path) ? 'active' : '', // Register the 'isActive' helper
        isActive: function(currentPath, ...paths) {
        // Remove the last argument (Handlebars options object)
        paths = paths.slice(0, -1);
        if (typeof currentPath !== 'string') return '';
        return paths.some(path => typeof path === 'string' && currentPath.startsWith(path)) ? 'active' : '';
      },
        concat: (...args) => args.slice(0, -1).join(''), // Register the 'concat' helper
        sum: (a, b) => a + b, // Register the 'sum' helper
    },
  
  layoutsDir: path.join(__dirname, 'resources/views/layouts'),
  partialsDir: path.join(__dirname, 'resources/views/partials'),
  defaultLayout: 'user' // Default to user layout
});


//Template engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to determine user role (example)
app.use((req, res, next) => {
  req.io = io; // Attach io to req object
  next();
});

route(app);


server.listen(port, () => {    
  console.log(`Example app listening at http://localhost:${port}`);
});