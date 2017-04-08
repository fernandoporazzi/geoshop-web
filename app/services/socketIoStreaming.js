const OnlineModel = require('../models/online.js');

function startListeningToOnlineCollections(socket) {
  socket.emit('startListeningToOnlineCollections', {data: `it will fetch the database for the user`});
}

module.exports = (io) => {
  var map =io
    .of('/map')
    .on('connection', function(socket) {
      startListeningToOnlineCollections(socket);

      socket.on('clickevent', (data) => {
        if (data.userName === 'Teste Pereira de Carvalho') {
          socket.emit('clickeventresponse', {message: `Hey man`});
        } else {
          socket.emit('clickeventresponse', {message: `Hey boy`});
        }
      });
    });
}
