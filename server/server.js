const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const app = express();
const databaseUrl = "mongodb://127.0.0.1:27017/mobilestore";

// Connect to MongoDB
mongoose.connect(databaseUrl);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Load models
require('./models/user');
const userModel = mongoose.model('user');
require('./models/product');
const productModel = mongoose.model('product');
require('./models/order');
const orderModel = mongoose.model('order');
require('./models/address');
const addressModel = mongoose.model('address');

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSession({ secret: 'my-temporary-session-secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./dist/mobilestore'));

// Passport configuration
passport.use('local', new localStrategy((username, password, done) => {
  userModel.findOne({ username })
    .then((user) => {
      if (!user) return done('User does not exist', null);

      user.comparePasswords(password, (error, isMatch) => {
        if (error) {
          return done(error, false);
        } else if (!isMatch) {
          return done('Password incorrect', false);
        } else {
          return done(null, user);
        }
      });
    })
    .catch((err) => done(err, false));
}));

passport.serializeUser((user, done) => {
  if (!user) return done('User missing', null);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  if (!user) return done('User missing', null);
  done(null, user);
});

// API routes
app.use('/api/user', require('./controllers/userController'));
app.use('/api/product', require('./controllers/productController'));
app.use('/api/order', require('./controllers/orderController'));
app.use('/api/address', require('./controllers/addressController'));

// Catch-all route for SPA
app.get('/*splat', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/mobilestore/index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Requested endpoint not found');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});