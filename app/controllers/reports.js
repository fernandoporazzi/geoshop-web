// app/controllers/reports.js
const SessionModel = require('../models/session.js');
const statesAndCities = require('../data/statesAndCities.json');

function buildQuery(req) {
  let query = {};
  
  console.log(req);

  if (req.productCode.trim() != '') {
    query.cart = {$elemMatch: {code: req.productCode}};
  }

  if (req.userName.trim() != '') {
    query.userName = {$regex: '.*' + req.userName + '.*', $options: 'i' }
  }

  if (req.uf != '') {
    query.uf = req.uf
  }

  if (req.city != '') {
    query.city = req.city
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
      isAuthenticated: req.isAuthenticated(),
      states: statesAndCities.estados
    });
  },

  getCityByState: (req, res, next) => {
    let cities;
    for (let i = 0; i < statesAndCities.estados.length; i++) {
      if (statesAndCities.estados[i].sigla.toLowerCase() === req.params.uf) {
        cities = statesAndCities.estados[i];
        break;
      }
    }

    res.json({cities: cities});
  },

  getData: (req, res, next) => {
    SessionModel.find(buildQuery(req.query), 
    (err, docs) => {
      res.render('reports', {
        title: 'GeoShop - Relatórios',
        storeName: req.user.storeName,
        storeId: req.user._id,
        isAuthenticated: req.isAuthenticated(),
        states: statesAndCities.estados,
        sessions: docs
      })
    })
  }
};
