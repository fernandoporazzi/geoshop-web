const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);
require('./app/services/socketIoStreaming')(io);

const configDB = require('./config/database.js');

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(helmet());
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// serve static
app.use(serveStatic(path.join(__dirname, 'app/public/dist/')));

// passport config
app.use(session({
  secret: 'geoshopwebapplication',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

require('./app/routes')(app, passport);

module.exports = app;
