'use strict';
let Koa = require('koa');
let session = require('koa-generic-session');
let body = require('koa-body');
let passport = require('koa-passport');
let Router = require('koa-router');
let views = require('koa-render');
let settings = require ('./settings');

// The app
let app = new Koa();

// Trust proxy
app.proxy = true

// Sessions
// TODO set up properly
app.keys = ['your-session-secret'];
app.use(session());

// Body parser
app.use(body());

// Authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// Append view renderer
app.use(views('./client', {
  map: { html: 'handlebars' },
  cache: false
}));

// Client routes
let router = new Router();

// GET /
router.get('/', function*() {
  this.body = yield this.render('login')
});

// POST /custom
router.post('/custom', function*(next) {
  let ctx = this
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

// GET /logout
router.get('/logout', function*(next) {
  this.logout(next)
  this.redirect('/')
});

// GET /auth/facebook
router.get('/auth/facebook',
  passport.authenticate('facebook')
);

// GET /auth/facebook/callback
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);

// Attach the router built above
app.use(router.middleware());

// Require authentication for now
app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/')
  }
});

// new router
let secured = new Router();

// GET /app
secured.get('/app', function*() {
  this.body = yield this.render('app')
});

// Be safe
app.use(secured.middleware());

// Start server
app.listen(settings.port);