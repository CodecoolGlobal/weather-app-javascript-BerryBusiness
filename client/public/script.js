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
      return acc + (record.precipitation || 0);
    }, 0);

    // Summing up precipitation per station
    const precipitationByStation = data.weather.reduce((acc, record) => {
      const stationId = record.source_id;
      
      // Check if the stationId is already in the accumulator
      if (!acc[stationId]) {
        // Find the corresponding source in the data.sources array
        const station = data.sources.find(src => src.id === stationId);
        
        // Initialize the station entry in the accumulator
        acc[stationId] = { 
          name: station.station_name, 
          precipitation: 0 
        };
      }
      
      // Accumulate precipitation
      acc[stationId].precipitation += (record.precipitation || 0);
      
      return acc;
    }, {});
    

    // Logging total precipitation and per station precipitation
    console.log('Total Precipitation:', totalPrecipitation);
    console.log('Precipitation per Station:', precipitationByStation);

    // Creating HTML for precipitation by station
    let stationPrecipitationHtml = '';
    for (const station in precipitationByStation) {
      stationPrecipitationHtml += `<p>Station: ${precipitationByStation[station].name} - Precipitation: ${precipitationByStation[station].precipitation} mm</p>`;
    }

    return `<div id="weather">
        <h1 id="cityname">Total Precipitation: ${totalPrecipitation} mm from ${startDate} to ${endDate}</h1>
        ${stationPrecipitationHtml}
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
      { lat: 53.63, lon: 9.9 },
      { lat: 49.011, lon: 10.93 },
      { lat: 51.866, lon: 9.270 }
  ];
  const maxDistArr = [50000, 200000, 100000, 75000];

  window.showRandomCoordinate = function () {
      const randomIndex = Math.floor(Math.random() * exampleCoordinates.length);
      const randomCoordinate = exampleCoordinates[randomIndex];
      const maxDist = maxDistArr[randomIndex];

      document.getElementById("coordinate").innerText = 
          `Random Coordinate: Latitude ${randomCoordinate.lat}, Longitude ${randomCoordinate.lon}, dist ${maxDist}`;

      document.getElementById("weather").innerHTML = '';
      
      fetchWeatherData(randomCoordinate.lat, randomCoordinate.lon, maxDist);
  };

  const fetchWeatherData = function (lat, lon, maxDist) {
    const startDate = startDateField.value;
    const endDate = endDateField.value;

    if (startDate && endDate) {
      if (new Date(startDate) <= new Date(endDate)) {
        spinner.removeAttribute('hidden');
        fetch(`https://api.brightsky.dev/weather?date=${startDate}&last_date=${endDate}&lat=${lat}&lon=${lon}&max_dist=${maxDist}`)
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

  endDateField.addEventListener('change', () => {
    const coordinateText = document.getElementById("coordinate").innerText;
    if (coordinateText) {
      const [latText, lonText] = coordinateText.match(/Latitude (\d+\.\d+), Longitude (\d+\.\d+)/).slice(1);
      fetchWeatherData(parseFloat(latText), parseFloat(lonText));
    }
  });
};

window.addEventListener('load', loadEvent);
