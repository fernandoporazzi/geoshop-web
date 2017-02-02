// app/controllers/home.js

module.exports = {

  index: (req, res, next) => {
    res.render('home', {
      title: 'GeoShop'
    });
  }

};
