// app/routes/index.js

const homeController = require('../controllers/home.js');
const instrumentationController = require('../controllers/instrumentation.js');


module.exports = function(app) {

  app.get('/__geoshop.gif', instrumentationController.index);

  app.get('/', homeController.index);

}
