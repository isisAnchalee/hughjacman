'use strict';
let passport = require('koa-passport');
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let settings = require('./settings');
let user = { id: 1, username: 'butts' };

// Serialize
passport.serializeUser((user, done)=> {
  done(null, user.id);
});

// Deserialize
passport.deserializeUser((id, done)=> {
  done(null, user);
});

// Butts Auth
passport.use(new LocalStrategy((username, password, done)=> {
  if (username === 'butts' && password === 'butts') {
    done(null, user)
  } else {
    done(null, false)
  }
}));

// Facebook Auth
passport.use(new FacebookStrategy({
  clientID: settings.facebookClientId,
  clientSecret: settings.facebookClientSecret,
  callbackURL: `${settings.host}:${settings.port}/auth/facebook/callback`
},
  (token, tokenSecret, profile, done)=> {
    done(null, user);
  }
));
