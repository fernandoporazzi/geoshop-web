// app/routes/index.js

const homeController = require('../controllers/home.js');
const instrumentationController = require('../controllers/instrumentation.js');
const dashboardController = require('../controllers/dashboard.js');
const loginController = require('../controllers/login.js');
const signupController = require('../controllers/signup.js');
const profileController = require('../controllers/profile.js');


module.exports = function(app, passport) {

  app.get('/__geoshop.gif', instrumentationController.index);

  app.get('/', homeController.index);

  app.get('/dashboard', isLoggedIn, dashboardController.index);
  app.get('/dashboard/:session', dashboardController.getSession);

  app.get('/profile', isLoggedIn, profileController.index);
  app.get('/profile/updatestore', isLoggedIn, profileController.updatestore);
  app.post('/profile/updatestore', isLoggedIn, profileController.saveStore);

  app.get('/login', loginController.index);

  app.get('/signup', signupController.index);

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}
