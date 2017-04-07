const mongoose = require('mongoose');

var onlineSchema = mongoose.Schema({
  session: {
    type: String
  },
  created_at: {
    type: Date,
    expires: 180
  }
});

onlineSchema.pre('save', function(next) {
  let d = new Date();
  this.created_at = d;

  next();
});

module.exports = mongoose.model('Online', onlineSchema);
