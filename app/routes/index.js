// app/routes/index.js

const homeController = require('../controllers/home.js');
const instrumentationController = require('../controllers/instrumentation.js');
const dashboardController = require('../controllers/dashboard.js');
const loginController = require('../controllers/login.js');
const signupController = require('../controllers/signup.js');


module.exports = function(app, passport) {

  app.get('/__geoshop.gif', instrumentationController.index);

  app.get('/', homeController.index);

  app.get('/dashboard', isLoggedIn, dashboardController.index);

  app.get('/login', loginController.index);

  app.get('/signup', signupController.index);

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}
