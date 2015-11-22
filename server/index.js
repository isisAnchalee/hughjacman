let koa = require('koa');
let settings = require ('./settings');
let session = require('koa-generic-session');
let bodyParser = require('koa-bodyparser');
let Router = require('koa-router');
let passport = require('koa-passport');
let views = require('koa-render');
require('./auth');

// the app
let app = koa();

// trust proxy
app.proxy = true

// sessions - todo - set up properly
app.keys = ['your-session-secret'];
app.use(session());

// body parser
app.use(bodyParser());

// authentication
app.use(passport.initialize());
app.use(passport.session());

// append view renderer
app.use(views('./client', {
  map: { html: 'handlebars' },
  cache: false
}));

// client routes
let router = new Router();

router.get('/', function*() {
  this.body = yield this.render('login')
});

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

let secured = new Router();

secured.get('/app', function*() {
  this.body = yield this.render('app')
});

app.use(secured.middleware());

// start server
app.listen(settings.port);