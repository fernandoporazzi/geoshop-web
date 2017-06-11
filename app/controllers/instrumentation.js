// app/controllers/instrumentation.js

const url = require('url');
const util = require('../util/geolocation.js');
const OnlineModel = require('../models/online.js');
const SessionModel = require('../models/session.js');

const imgdata = [
  0x47,0x49, 0x46,0x38, 0x39,0x61, 0x01,0x00, 0x01,0x00, 0x80,0x00, 0x00,0xFF, 0xFF,0xFF,
  0x00,0x00, 0x00,0x21, 0xf9,0x04, 0x04,0x00, 0x00,0x00, 0x00,0x2c, 0x00,0x00, 0x00,0x00,
  0x01,0x00, 0x01,0x00, 0x00,0x02, 0x02,0x44, 0x01,0x00, 0x3b
];

const imgbuf = new Buffer(imgdata);

module.exports = {

  index: (req, res, next) => {

    // req.query.p = page
    // req.query.un = username
    // req.query.ue = useremail
    // req.query.login = if user is logged, true or false
    // req.query.storeId = storeId - mongoid
    // req.query.s = session
    // req.query.lat = latitude
    // req.query.lng = longitude
    // req.query.c =  cart

    console.log(req.query.c);

    OnlineModel.findOne({session: req.query.s}, (err, doc) => {
      if (err) return next();

      // update document date
      if (doc) {
        console.log('document exists and should be updated');
        let d = new Date();

        doc.created_at = d;
        doc.save();
        return;
      }

      // create new online document
      if (!doc) {
        console.log('doesnt exists and will be created');
        online = new OnlineModel({
          session: req.query.s,
          storeId: req.query.storeId,
          lat: req.query.lat,
          lng: req.query.lng,
        });

        online.save();
        return;
      }
    });

    // let ip = req.connection.remoteAddress;
    // console.log(util.getGeolocation(ip));

    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': imgdata.length,
    });
    res.end(imgbuf);
  }

};
