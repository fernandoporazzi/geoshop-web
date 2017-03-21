// app/controllers/signup.js

module.exports = {

  index: (req, res, next) => {
    res.render('signup', {
      title: 'GeoShop - sign up'
    });
  }

};
