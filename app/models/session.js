const mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
  session: String,
  storeId: String,
  created_at: {type: Date, default: Date.now},
  userName: String,
  userEmail: String,
  lat: String,
  lng: String,
  cart: [],
  navigation: [String],
  completed: Boolean
});

module.exports = mongoose.model('Session', sessionSchema);
