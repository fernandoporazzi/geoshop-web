// app/controllers/login.js

module.exports = {

  index: (req, res, next) => {
    res.render('login', {
      title: 'GeoShop - Login'
    });
  }

};
