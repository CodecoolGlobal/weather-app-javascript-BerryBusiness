// Array of example coordinates
const exampleCoordinates = [
  { lat: 54.170, lon: 7.50 },
  { lat: 54.180, lon: 6.40 },
  { lat: 55.000, lon: 8.00 },
  { lat: 54.200, lon: 7.80 }
];

// Function to show a random coordinate and find the closest station
function showRandomCoordinate() {
  const randomIndex = Math.floor(Math.random() * exampleCoordinates.length);
  const randomCoordinate = exampleCoordinates[randomIndex];

  document.getElementById("coordinate").innerText = 
      `Random Coordinate: Latitude ${randomCoordinate.lat}, Longitude ${randomCoordinate.lon}`;

  const closestStation = findClosestStation(randomCoordinate.lat, randomCoordinate.lon);

  document.getElementById("result").innerText = 
      `The closest station ID is: ${closestStation.id}`;
}
