function welcomeElement() {
  return `<div id="searchbar">
      <input type="date" id="dateField" name="dateField">
  </div>
  <button id="coord" onclick="showRandomCoordinate()">Get Random Coordinate</button>
  <p id="coordinate"></p>
  <p id="result"></p>`;
}

function precipitationElement(data, date) {
  const weatherData = data.weather.find(day => day.timestamp.startsWith(date));
  if (weatherData) {
      return `<div id="weather">
          <h1 id="cityname">${data.sources[0].station_name}</h1>
          <p id="precipitation">Precipitation: ${weatherData.precipitation} mm on ${date}</p>
      </div>`;
  } else {
      return `<div id="weather">
          <h1 id="cityname">${data.sources[0].station_name}</h1>
          <p id="precipitation">No data available for the selected date.</p>
      </div>`;
  }
}

function loadEvent() {
  const rootElement = document.getElementById('root');
  rootElement.insertAdjacentHTML('beforeend', welcomeElement());
  rootElement.insertAdjacentHTML('beforeend', '<div hidden id="spinner"></div>');

  const dateField = document.getElementById('dateField');
  const spinner = document.getElementById('spinner');

  function toRadians(degrees) {
      return degrees * Math.PI / 180;
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in kilometers
  }

  // Array of weather stations with their IDs and coordinates
  const stations = [
      { id: 1228, lat: 54.165071, lon: 6.346049 },
      { id: 954, lat: 54.1667, lon: 7.45 },
      { id: 2115, lat: 54.174957, lon: 7.891954 },
      { id: 3032, lat: 55.010987, lon: 8.412538 }
  ];

  // Function to find the closest station given an input latitude and longitude
  window.findClosestStation = function(inputLat, inputLon) {
      let closestStation = null;
      let minDistance = Infinity;

      stations.forEach(station => {
          const distance = haversineDistance(inputLat, inputLon, station.lat, station.lon);
          if (distance < minDistance) {
              minDistance = distance;
              closestStation = station;
          }
      });

      return closestStation;
  };

  const fetchWeatherData = function () {
      const date = dateField.value;

      if (date) {
          spinner.removeAttribute('hidden');

          latitudeValues.forEach(lat => {
              fetch(`https://api.brightsky.dev/weather?lat=${lat}&date=${date}`)
                  .then(response => response.json())
                  .then(data => {
                      spinner.setAttribute('hidden', '');
                      rootElement.insertAdjacentHTML('beforeend', precipitationElement(data, date));
                  })
                  .catch(error => {
                      spinner.setAttribute('hidden', '');
                      console.error(error);
                  });
          });
      }
  };

  dateField.addEventListener('change', fetchWeatherData);
}

window.addEventListener('load', loadEvent);
