const welcomeElement = function () {
  return `<div id="searchbar">
      <i class="fa-sharp fa-solid fa-location-dot" style="color: #64c3f6"></i>
      <input type="date" id="dateField" name="dateField">
  </div>
  <button onclick="showRandomCoordinate()">Get Random Coordinate</button>
  <p id="coordinate"></p>
  <div id="weather"></div>
  <div hidden id="spinner">Loading...</div>`;
};

const precipitationElement = function (data, date) {
  if (data.weather.length > 0) {
      const totalPrecipitation = data.weather.reduce((acc, record) => acc + (record.precipitation || 0), 0);
      return `<div id="weather">
          <h1 id="cityname">${data.sources[0]?.station_name || "Unknown Station"}</h1>
          <p id="precipitation">Total Precipitation: ${totalPrecipitation} mm on ${date}</p>
      </div>`;
  } else {
      return `<div id="weather">
          <h1 id="cityname">No data available</h1>
          <p id="precipitation">No data available for the selected date.</p>
      </div>`;
  }
};

const loadEvent = function () {
  const rootElement = document.getElementById('root');
  rootElement.insertAdjacentHTML('beforeend', welcomeElement());

  const dateField = document.getElementById('dateField');
  const spinner = document.getElementById('spinner');

  const exampleCoordinates = [
      { lat: 54.170, lon: 7.50 },
      { lat: 54.180, lon: 6.40 },
      { lat: 55.000, lon: 8.00 },
      { lat: 54.200, lon: 7.80 }
  ];

  window.showRandomCoordinate = function () {
      const randomIndex = Math.floor(Math.random() * exampleCoordinates.length);
      const randomCoordinate = exampleCoordinates[randomIndex];

      document.getElementById("coordinate").innerText = 
          `Random Coordinate: Latitude ${randomCoordinate.lat}, Longitude ${randomCoordinate.lon}`;

      fetchWeatherData(randomCoordinate.lat, randomCoordinate.lon);
  };

  const fetchWeatherData = function (lat, lon) {
      const date = dateField.value;
      if (date) {
          spinner.removeAttribute('hidden');
          fetch(`https://api.brightsky.dev/weather?date=${date}&lat=${lat}&lon=${lon}&max_dist=5000`)
              .then(response => response.json())
              .then(data => {
                  spinner.setAttribute('hidden', '');
                  console.log(data);
                  rootElement.insertAdjacentHTML('beforeend', precipitationElement(data, date));
              })
              .catch(error => {
                  spinner.setAttribute('hidden', '');
                  console.error(error);
              });
      }
  };

  dateField.addEventListener('change', () => {
      const coordinateText = document.getElementById("coordinate").innerText;
      if (coordinateText) {
          const [latText, lonText] = coordinateText.match(/Latitude (\d+\.\d+), Longitude (\d+\.\d+)/).slice(1);
          fetchWeatherData(parseFloat(latText), parseFloat(lonText));
      }
  });
};

window.addEventListener('load', loadEvent);
