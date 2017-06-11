var map,
  markersArray = [];

function getOnlineUsers() {
  var socket = io.connect('http://localhost:3000/map'),
    storeId = GeoShop.storeId,
    onlineQtyWrapper = document.getElementById('online-qty');

  socket.emit('getOnlineUsers', {storeId: storeId});

  socket.on('updateOnlineUsers', function(response) {
    console.log(response.data);
    onlineQtyWrapper.innerHTML = response.data.length;

    if (response.data.length) {
      centerMap(response.data[0]);
      addMarkers(response.data);
    } else {
      clearMarkers();
    }
  });

  setInterval(function() {
    socket.emit('getOnlineUsers', {storeId: storeId});
  }, 60000);
}

function centerMap(data) {
  var center = new google.maps.LatLng(data.lat, data.lng);
  map.panTo(center);
}

function addMarkers(data) {
  var i = 0;
  for (i; i < data.length; i++) {
    var self = data[i],
      latLng = new google.maps.LatLng(self.lat, self.lng),
      marker = new google.maps.Marker({
        position: latLng,
        title: 'click here',
        session: self.session
      });

      marker.addListener('click', function() {
        getInformationBySession(this.session);
      });

      markersArray.push(marker);

      marker.setMap(map);
  }
}

function clearMarkers() {
  var i = 0;
  for (i; i < markersArray.length;  i++) {
    markersArray[i].setMap(null);
  }

  // reset array
  markersArray = [];
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 10
  });
}

function getInformationBySession(session) {
  fetch('/dashboard/'+session)
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      console.log('server data', data);
    })
}

getOnlineUsers();
