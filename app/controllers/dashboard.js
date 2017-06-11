// app/controllers/dashboard.js
const SessionModel = require('../models/session.js');

module.exports = {

  index: (req, res, next) => {
    res.render('dashboard', {
      title: 'GeoShop - Dashboard',
      storeName: req.user.storeName,
      storeId: req.user._id,
      isAuthenticated: req.isAuthenticated()
    });
  },

  getSession: (req, res, next) => {
    SessionModel.findOne({session: req.params.session}, (err, doc) => {
      if (err)
        return res.status(500).json({error: err });

      res.json(doc);
    })
  }
};
