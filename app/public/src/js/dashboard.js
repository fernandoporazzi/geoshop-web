var map,
  markersArray = [];

function bindEvents() {
  document.querySelector('.overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.add('none');
    }
  }, false);
}

function getOnlineUsers() {
  var socket = io.connect('http://localhost:3000/map'),
    storeId = GeoShop.storeId,
    onlineQtyWrapper = document.getElementById('online-qty'),
    cartValueWrapper = document.getElementById('cart-total');

  socket.emit('getOnlineUsers', {storeId: storeId});
  socket.emit('getCartValueForOnlineUsers', {storeId: storeId});

  socket.on('updateOnlineUsers', function(response) {
    onlineQtyWrapper.innerHTML = response.data.length;

    if (response.data.length) {
      centerMap(response.data[0]);
      addMarkers(response.data);
    } else {
      clearMarkers();
    }
  });

  socket.on('updateCartValueForOnlineUsers', function(response) {
    cartValueWrapper.innerText = 'R$ ' + response.data;
  })

  setInterval(function() {
    socket.emit('getOnlineUsers', {storeId: storeId});
    socket.emit('getCartValueForOnlineUsers', {storeId: storeId});
  }, 30000);
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
      openSessionModal(data);
    })
}

function openSessionModal(data) {
  var htmlToInject = '<p><strong>Nome do usuário:</strong> '+data.userName+'</p>'+
    '<p><strong>Email do usuário:</strong> '+ data.userEmail+'</p>'+
    '<p><strong>Localização:</strong> '+data.lat + '/'+ data.lng +'</p>'+
    '<p><strong>Navegação:</strong> '+ data.navigation.join(' -> ') +'</p>'+
    '<p><strong>Carrinho:</strong> <ul>' + getModalCartInfo(data.cart) + '</ul></p>';

  document.querySelector('.overlay-main').innerHTML = htmlToInject;
  document.querySelector('.overlay').classList.remove('none');
}

function getModalCartInfo(cart) {
  var liArray = [];

  for (var i = 0; i < cart.length; i++) {
    var li = '<li>'+
      '<div><strong>Código do produto:</strong> '+ cart[i].code +'</div>'+
      '<div><strong>Nome do produto:</strong> '+ cart[i].name +'</div>'+
      '<div><strong>Quantidade:</strong> '+ cart[i].quantity +'</div>'+
      '<div><strong>Preço do produto:</strong> '+ cart[i].price +'</div>'+
    '</li>';

    liArray.push(li);
  }

  return liArray.join('');
}

getOnlineUsers();
bindEvents();
