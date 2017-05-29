const OnlineModel = require('../models/online.js');

function getOnlineUsers(socket, data) {
  OnlineModel.find({storeId: data.storeId}, (err, docs) => {
    if (err != null) {
      return log.info('Error while fetching initial data');
    }

    socket.emit('updateOnlineUsers', {data: docs});
  });
}

module.exports = (io) => {
  var map = io
    .of('/map')
    .on('connection', function(socket) {
      socket.on('getOnlineUsers', (data) => {
        getOnlineUsers(socket, data);
      })
    });
}
