'use strict';
var koa = require('koa');
var settings = require ('./settings');

var app = koa();

// trust proxy
app.proxy = true

// sessions
var session = require('koa-generic-session');
app.keys = ['your-session-secret'];
app.use(session());

// body parser
var bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// authentication
require('./auth');
var passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// append view renderer
var views = require('koa-render');
app.use(views('./client', {
  map: { html: 'handlebars' },
  cache: false
}));

// client routes
var Router = require('koa-router');

var router = new Router();

router.get('/', function*() {
  this.body = yield this.render('login')
});

router.post('/custom', function*(next) {
  var ctx = this
  yield passport.authenticate('local', function*(err, user) {
    if (err) throw err
    if (user === false) {
      ctx.status = 401
      ctx.body = { success: false }
    } else {
      yield ctx.login(user)
      ctx.body = { success: true }
    }
  }).call(this, next)
});

// POST /login
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);

router.get('/logout', function*(next) {
  this.logout(next)
  this.redirect('/')
});

router.get('/auth/facebook',
  passport.authenticate('facebook')
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);

router.get('/auth/twitter',
  passport.authenticate('twitter')
);

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);

app.use(router.middleware());

// Require authentication for now
app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/')
  }
});

var secured = new Router();

secured.get('/app', function*() {
  this.body = yield this.render('app')
});

app.use(secured.middleware());

// start server
app.listen(settings.port);