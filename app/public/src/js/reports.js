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