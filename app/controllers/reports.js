// app/controllers/reports.js
const SessionModel = require('../models/session.js');

module.exports = {

  index: (req, res, next) => {
    res.render('reports', {
      title: 'GeoShop - Relatórios',
      storeName: req.user.storeName,
      storeId: req.user._id,
      isAuthenticated: req.isAuthenticated()
    });
  }
};
