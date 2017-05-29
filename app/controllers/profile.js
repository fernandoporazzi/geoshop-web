// app/controllers/profile.js

const UserModel = require('../models/user.js');

module.exports = {

  index: (req, res, next) => {
    res.render('profile', {
      title: 'GeoShop - Perfil',
      storeName: req.user.storeName,
      storeId: req.user._id,
      isAuthenticated: req.isAuthenticated()
    });
  },

  updatestore: (req, res, next) => {
    res.render('profile_updatestore', {
      title: 'GeoShop - Alterar loja',
      storeName: req.user.storeName,
      storeId: req.user._id,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
  },

  saveStore: (req, res, next) => {
    UserModel.update({_id: req.user._id}, {
      $set: {
        storeName: req.body.storeName
      }
    }, function(err, data) {
      if (err) return next()

      res.redirect('/profile/')
    });
  }

};
