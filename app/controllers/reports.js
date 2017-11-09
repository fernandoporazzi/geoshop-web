// app/controllers/reports.js
const SessionModel = require('../models/session.js');
const statesAndCities = require('../data/statesAndCities.json');

function filterPages(docs) {
  let pages = [];
  for (let i = 0; i < docs.length; i++) {
    for (let j = 0; j < docs[i].navigation.length; j++) {
      if (docs[i].navigation[j] != null) {
        let part = docs[i].navigation[j].split(' ')[0];
        if (!pages.includes(part)) {
          pages.push(part);
        }
      }
    }
  }
  return pages.sort();
}

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
    SessionModel.find({}, 'navigation',(err, docs) => {
      let pages = filterPages(docs);

      res.render('reports', {
        title: 'GeoShop - Relatórios',
        storeName: req.user.storeName,
        storeId: req.user._id,
        isAuthenticated: req.isAuthenticated(),
        states: statesAndCities.estados,
        pages: pages
      });
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

      if (req.query.lastpage != '') {
        let refine = [];
        for (let i = 0; i < docs.length; i++) {
          let nav = docs[i].navigation;
          let lastItem = nav[nav.length - 1];

          if (lastItem && lastItem.includes(req.query.lastpage)) {
            refine.push(docs[i]);
          }
        }
        docs = refine;
      }

      SessionModel.find({}, 'navigation',(err, navdocs) => {
        let pages = filterPages(navdocs);
      
        res.render('reports', {
          title: 'GeoShop - Relatórios',
          storeName: req.user.storeName,
          storeId: req.user._id,
          isAuthenticated: req.isAuthenticated(),
          states: statesAndCities.estados,
          pages: pages,
          sessions: docs
        })
      });
    })
  }
};
