// app/controllers/dashboard.js

module.exports = {

  index: (req, res, next) => {
    res.render('dashboard', {
      title: 'GeoShop - Dashboard',
      storeName: req.user.storeName,
      storeId: req.user._id,
      isAuthenticated: req.isAuthenticated()
    });
  }

};
