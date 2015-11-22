'use strict';
var passport = require('koa-passport');
var settings = require('./settings');
var user = { id: 1, username: 'test' };

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, user);
});

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done) {
  // retrieve user ...
  if (username === 'butts' && password === 'butts') {
    done(null, user)
  } else {
    done(null, false)
  }
}));

var FacebookStrategy = require('passport-facebook').Strategy
passport.use(new FacebookStrategy({
  clientID: settings.facebookClientId,
  clientSecret: settings.facebookClientSecret,
  callbackURL: settings.host + ':' settings.port + '/auth/facebook/callback'
},
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));
