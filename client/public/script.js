const welcomeElement = function () {
  return `<div id="searchbar">
      <input type="date" id="startDateField" name="startDateField" required>
      <input type="date" id="endDateField" name="endDateField" required>
  </div>
  <button onclick="showRandomCoordinate()">Get Random Coordinate</button>
  <p id="coordinate"></p>
  <div id="weather"></div>
  <div hidden id="spinner">Loading...</div>`;
};

const precipitationElement = function (data, startDate, endDate) {
  if (data.weather.length > 0) {
    const totalPrecipitation = data.weather.reduce((acc, record) => {
      console.log('Accumulated precipitation so far:', acc);
      console.log('Current record precipitation:', record.precipitation || 0);
      return acc + (record.precipitation || 0);
    }, 0);
    return `<div id="weather">
        <h1 id="cityname">${data.sources[0]?.station_name || "Unknown Station"}</h1>
        <p id="precipitation">Total Precipitation: ${totalPrecipitation} mm from ${startDate} to ${endDate}</p>
    </div>`;
  } else {
    return `<div id="weather">
        <h1 id="cityname">No data available</h1>
        <p id="precipitation">No data available for the selected date range.</p>
    </div>`;
  }
};

const loadEvent = function () {
  const rootElement = document.getElementById('root');
  rootElement.insertAdjacentHTML('beforeend', welcomeElement());

  const startDateField = document.getElementById('startDateField');
  const endDateField = document.getElementById('endDateField');
  const spinner = document.getElementById('spinner');

  const exampleCoordinates = [
      { lat: 53.7, lon: 8.6 },
      { lat: 54.180, lon: 6.40 },
      { lat: 55.000, lon: 8.00 },
      { lat: 54.200, lon: 7.80 }
  ];

  window.showRandomCoordinate = function () {
      const randomIndex = Math.floor(Math.random() * exampleCoordinates.length);
      const randomCoordinate = exampleCoordinates[randomIndex];

      document.getElementById("coordinate").innerText = 
          `Random Coordinate: Latitude ${randomCoordinate.lat}, Longitude ${randomCoordinate.lon}`;

      document.getElementById("weather").innerHTML = '';
      
      fetchWeatherData(randomCoordinate.lat, randomCoordinate.lon);
  };

  const fetchWeatherData = function (lat, lon) {
    const startDate = startDateField.value;
    const endDate = endDateField.value;

    if (startDate && endDate) {
      if (new Date(startDate) <= new Date(endDate)) {
        spinner.removeAttribute('hidden');
        fetch(`https://api.brightsky.dev/weather?date=${startDate}&last_date=${endDate}&lat=${lat}&lon=${lon}&max_dist=5000`)
          .then(response => response.json())
          .then(data => {
            spinner.setAttribute('hidden', '');
            console.log(data);
            rootElement.insertAdjacentHTML('beforeend', precipitationElement(data, startDate, endDate));
          })
          .catch(error => {
            spinner.setAttribute('hidden', '');
            console.error(error);
          });
      } else {
        alert("End date must be later than start date.");
      }
    }
  };

 /* startDateField.addEventListener('change', () => {
    const coordinateText = document.getElementById("coordinate").innerText;
    if (coordinateText) {
      const [latText, lonText] = coordinateText.match(/Latitude (\d+\.\d+), Longitude (\d+\.\d+)/).slice(1);
      fetchWeatherData(parseFloat(latText), parseFloat(lonText));
    }
  });*/

  endDateField.addEventListener('change', () => {
    const coordinateText = document.getElementById("coordinate").innerText;
    if (coordinateText) {
      const [latText, lonText] = coordinateText.match(/Latitude (\d+\.\d+), Longitude (\d+\.\d+)/).slice(1);
      fetchWeatherData(parseFloat(latText), parseFloat(lonText));
    }
  });
};

window.addEventListener('load', loadEvent);
