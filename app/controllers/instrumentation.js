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

    console.log(req.query.p);
    console.log(req.query.un);
    console.log(req.query.ue);
    console.log(req.query.login);

    online = new OnlineModel({
      session: 'abc123'
    });

    let p = online.save();

    // let ip = req.connection.remoteAddress;
    // console.log(util.getGeolocation(ip));

    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': imgdata.length,
    });
    res.end(imgbuf);
  }

};
