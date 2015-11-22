let passport = require('koa-passport');
let settings = require('./settings');
let user = { id: 1, username: 'butts' };

passport.serializeUser((user, done)=> {
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  done(null, user);
});

// Butts Auth
let LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, done)=> {
  if (username === 'butts' && password === 'butts') {
    done(null, user)
  } else {
    done(null, false)
  }
}));

// Facebook Auth
let FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: settings.facebookClientId,
  clientSecret: settings.facebookClientSecret,
  callbackURL: `${settings.host}:${settings.port}/auth/facebook/callback`
},
  (token, tokenSecret, profile, done)=> {
    done(null, user);
  }
));
