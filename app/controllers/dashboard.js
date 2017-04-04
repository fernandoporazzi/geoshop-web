// app/controllers/dashboard.js

module.exports = {

  index: (req, res, next) => {
    res.render('dashboard', {
      title: 'GeoShop - Dashboard'
    });
  }

};
