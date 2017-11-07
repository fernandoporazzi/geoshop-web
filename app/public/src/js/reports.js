function bindEvents() {
  document.querySelector('.js-uf-select').addEventListener('change', function() {
    fetch('/reports/cities/'+this.value.toLowerCase())
      .then(function(resp) {
        return resp.json();
      })
      .then(function(data) {
        populateCitiesSelect(data);
      })
  }, false);

  var $sessions = document.querySelectorAll('.js-session');

  for (var i = 0; i < $sessions.length; i++) {
    $sessions[i].addEventListener('click', function() {
      this.classList.toggle('active');
    }, false);
  }
}

function populateCitiesSelect(data) {
  var $select = document.querySelector('.js-city-select'),
    cities = ['<option value=""></option>'];  

  for (var i = 0; i < data.cities.cidades.length; i++) {
    cities.push('<option value="' + data.cities.cidades[i] + '">' + data.cities.cidades[i] + '</option>');
  }

  cities.join('');

  $select.innerHTML = cities;
}

bindEvents()