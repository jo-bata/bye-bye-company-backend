const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const config = require('./config/config');
const passportConfig = require('./config/passport');
const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: config.session.secret,
  resave: config.session.resave,
  saveUninitialized: config.session.saveUninitialized,
  store: new MySQLStore({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
  })
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();
app.use('/auth/', auth);
app.use('/user/', user);

module.exports = app;