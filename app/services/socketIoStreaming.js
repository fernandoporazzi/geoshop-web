const OnlineModel = require('../models/online.js');

module.exports = (io) => {
  var map =io
    .of('/map')
    .on('connection', function(socket) {
      socket.on('clickevent', (data) => {
        console.log('clickevent received:', data);
        socket.emit('clickeventresponse', {message: 'the server received the value'});
      });
    });
}
