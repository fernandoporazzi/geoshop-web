const OnlineModel = require('../models/online.js');
const SessionModel = require('../models/session.js');

function getOnlineUsers(socket, data) {
  OnlineModel.find({storeId: data.storeId}, (err, docs) => {
    if (err != null) {
      return log.info('Error while fetching initial data');
    }

    socket.emit('updateOnlineUsers', {data: docs});
  });
}

function getCartValueForOnlineUsers(socket, data) {
  OnlineModel.find({storeId: data.storeId}, (err, onlineDocs) => {
    if (err != null) {
      return log.info('Error while fetching initial data');
    }

    var totalPrice = 0;

    for (var i = 0; i < onlineDocs.length; i++) {
      var self = onlineDocs[i];

      SessionModel.findOne({session: self.session}, (err, doc) => {
        if (err != null) {
          return log.info('Error while fetching cart value data');
        }

        const cartEntries = doc.cart;

        for (var j = 0; j < cartEntries.length; j++) {
          let entry = cartEntries[j];

          const qty = entry.quantity
          const price = parseInt(entry.price ? entry.price.replace('R$', '') : 400)

          totalPrice += (qty * price)
        }
      });
    }

    setTimeout(function() {
      socket.emit('updateCartValueForOnlineUsers', {data: totalPrice});
    }, 2000)
  });
}

module.exports = (io) => {
  var map = io
    .of('/map')
    .on('connection', function(socket) {
      socket.on('getOnlineUsers', (data) => {
        getOnlineUsers(socket, data);
      });

      socket.on('getCartValueForOnlineUsers', (data) => {
        getCartValueForOnlineUsers(socket, data)
      })
    });
}
