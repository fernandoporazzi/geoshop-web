const mongoose = require('mongoose');

var onlineSchema = mongoose.Schema({
  session: {
    type: String
  },
  storeId: {
    type: String
  },
  created_at: {
    type: Date,
    expires: 120
  },
  lat: {
    type: String
  },
  lng: {
    type: String,
  }
});

onlineSchema.pre('save', function(next) {
  let d = new Date();
  this.created_at = d;

  next();
});

module.exports = mongoose.model('Online', onlineSchema);
