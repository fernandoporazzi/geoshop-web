// app/controllers/reports.js
const SessionModel = require('../models/session.js');

function buildQuery(req) {
  let query = {};
  
  console.log(req);

  if (req.productCode.trim() != '') {
    query.cart = {$elemMatch: {code: req.productCode}};
  }

  if (req.userName.trim() != '') {
    query.userName = {$regex: '.*' + req.userName + '.*', $options: 'i' }
  }

  if (req.completed) {
    query.completed = req.completed;
  }

  console.log('_____');

  console.log(query);

  return query;
}

module.exports = {

  index: (req, res, next) => {
    res.render('reports', {
      title: 'GeoShop - Relatórios',
      storeName: req.user.storeName,
      storeId: req.user._id,
      isAuthenticated: req.isAuthenticated()
    });
  },

  getData: (req, res, next) => {
    

    SessionModel.find(buildQuery(req.query), 
    (err, docs) => {
      res.render('reports', {
        title: 'GeoShop - Relatórios',
        storeName: req.user.storeName,
        storeId: req.user._id,
        isAuthenticated: req.isAuthenticated(),
        sessions: docs
      })
    })
  }
};
