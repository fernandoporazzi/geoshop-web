// app/controllers/instrumentation.js

const url = require('url');
const util = require('../util/geolocation.js');
const OnlineModel = require('../models/online.js');

const imgdata = [
  0x47,0x49, 0x46,0x38, 0x39,0x61, 0x01,0x00, 0x01,0x00, 0x80,0x00, 0x00,0xFF, 0xFF,0xFF,
  0x00,0x00, 0x00,0x21, 0xf9,0x04, 0x04,0x00, 0x00,0x00, 0x00,0x2c, 0x00,0x00, 0x00,0x00,
  0x01,0x00, 0x01,0x00, 0x00,0x02, 0x02,0x44, 0x01,0x00, 0x3b
];

const imgbuf = new Buffer(imgdata);

module.exports = {

  index: (req, res, next) => {

    // console.log(req.query.p);
    // console.log(req.query.un);
    // console.log(req.query.ue);
    // console.log(req.query.login);
    // console.log(req.query.store);
    // console.log(req.query.s)

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
          store: req.query.store
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
