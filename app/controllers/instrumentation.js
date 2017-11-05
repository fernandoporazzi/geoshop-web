// app/controllers/instrumentation.js

const url = require('url');
const axios = require('axios');
const util = require('../util/geolocation.js');
const OnlineModel = require('../models/online.js');
const SessionModel = require('../models/session.js');

const imgdata = [
  0x47,0x49, 0x46,0x38, 0x39,0x61, 0x01,0x00, 0x01,0x00, 0x80,0x00, 0x00,0xFF, 0xFF,0xFF,
  0x00,0x00, 0x00,0x21, 0xf9,0x04, 0x04,0x00, 0x00,0x00, 0x00,0x2c, 0x00,0x00, 0x00,0x00,
  0x01,0x00, 0x01,0x00, 0x00,0x02, 0x02,0x44, 0x01,0x00, 0x3b
];

const imgbuf = new Buffer(imgdata);

function getUfAndCity(location) {
  let city, uf;

  for (let i = 0; i < location.length; i++) {
    let self = location[i];

    if (self.types.includes('administrative_area_level_2')) {
      city = self.long_name;
    }

    if (self.types.includes('administrative_area_level_1')) {
      uf = self.long_name;
    }
  }

  return {city, uf};
}

function getCartObjects(query) {
  if (!query || query === '') return [];

  let cartData = [];
  let entries = query.split('|');

  for (let i = 0; i < entries.length; i++) {
    const self = entries[i];
    const props = self.split(';');
    let obj = {};

    for (let j = 0; j < props.length; j++) {
      const arr = props[j].split(':');
      obj[arr[0]] = arr[1];
    }

    cartData = cartData.concat(obj);
  }

  return cartData;
}

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

    SessionModel.findOne({session: req.query.s},(err, doc) => {
      if (err) return next();

      const cartData = getCartObjects(req.query.c);

      if (doc) {
        console.log('update session document');
        doc.userName = req.query.un;
        doc.userEmail = req.query.ue;
        doc.cart = cartData;

        if (doc.navigation[doc.navigation.length - 1] != req.query.p) {
          doc.navigation = doc.navigation.concat(req.query.p);
        }

        doc.completed = req.query.completed || false;

        doc.save();
        return;
      }

      if (!doc) {
        console.log('create new session document');
        
        axios.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${req.query.lat},${req.query.lng}&sensor=true`)
          .then( mapsResponse => {
            const {city, uf} = getUfAndCity(mapsResponse.data.results[0].address_components);
            
            let session = new SessionModel({
              session: req.query.s,
              storeId: req.query.storeId,
              userName: req.query.un,
              userEmail: req.query.ue,
              lat: req.query.lat,
              lng: req.query.lng,
              city: city,
              uf: uf,
              cart: cartData,
              navigation: [req.query.p],
              completed: req.query.completed || false
            });
    
            session.save();
          } )
          .catch( error => {
            console.log('get google maps error', error)
          } );
      }
    });

    OnlineModel.findOne({session: req.query.s}, (err, doc) => {
      if (err) return next();

      // update document date
      if (doc) {
        console.log('update online document');
        let d = new Date();

        doc.created_at = d;
        doc.save();
        return;
      }

      // create new online document
      if (!doc) {
        console.log('create new online document');
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
