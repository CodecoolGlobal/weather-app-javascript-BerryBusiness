const welcomeElement = function () {
  return `<div id="searchbar">
  <i class="fa-sharp fa-solid fa-location-dot" style="color: #64c3f6"></i>
  <input list="cities" id="inputField" name="inputField" placeholder="Enter your location">
  <datalist id="cities"></datalist>
  </div>
  `;
};

const weatherElement = function (data) {
  return `<div id=weather>
  <div id="cityname">
  <h1 id="currentname">${data.location.name}</h1>
  <button id="favoritebutton"><i id="star" class="fa-regular fa-star"></i></button>
  </div>
  <h2 id="currentcond">${data.current.condition.text}</h2>
  <img id="weatherIcon" src="${data.current.condition.icon}">
  <p id="temp">${data.current.temp_c}°</p>
  <div id="details">
  <i id="humidityicon" class="fa-solid fa-water"></i>
  <p id="humidity">${data.current.humidity}%</p>
  <i id="windicon" class="fa-solid fa-wind"></i>
  <p id="wind">${data.current.wind_kph}kph</p>
  </div>
  </div>
  `;
};

HTMLElement.prototype.unchecked = function () {
  if (this.tagName === 'I' && this.classList.contains('fa-star')) {
    this.classList.remove('fa-solid');
    this.classList.remove('fa-star');
    this.classList.add('fa-regular');
    this.classList.add('fa-star');
  } else {
    throw new TypeError('usable only on fa-star icon');
  }
};

HTMLElement.prototype.checked = function () {
  if (this.tagName === 'I' && this.classList.contains('fa-star')) {
    this.classList.remove('fa-regular');
    this.classList.remove('fa-star');
    this.classList.add('fa-solid');
    this.classList.add('fa-star');
  } else {
    throw new TypeError('usable only on fa-star icon');
  }
};

const loadEvent = function () {
  const rootElement = document.getElementById('root');
  rootElement.insertAdjacentHTML('beforeend', welcomeElement());
  rootElement.insertAdjacentHTML('beforeend', '<div hidden id="spinner"></div>');
  const inputField = document.getElementById('inputField');
  const datalist = document.getElementById('cities');
  const spinner = document.getElementById('spinner');
  let options;
  const favorites = [];
  inputField.addEventListener('input', function () {
    const text = inputField.value;
    if (document.getElementById('weather')) {
      document.getElementById('weather').parentNode.removeChild(document.getElementById('weather'));
    }
    rootElement.style.height = '5%';
    rootElement.style.alignItems = 'center';
    if (text.length > 2) {
      fetch(`http://api.weatherapi.com/v1/search.json?key=bc01654e446444bd9fa122536232003&q=${text}`)
        .then((response) => response.json())
        .then((data) => {
          datalist.innerHTML = '';
          options = data.map((option) => {
            if (option.region === '') {
              return `${option.name}, ${option.country}`;
            }
            return `${option.name}, ${option.region}, ${option.country}`;
          });
          options.forEach(function (item) {
            const option = document.createElement('option');
            option.value = item;
            datalist.appendChild(option);
          });
        })
        .catch((error) => console.error(error));
    }
    const opts = datalist.childNodes;
    for (const opt of opts) {
      if (opt.value === inputField.value) {
        inputField.blur();
        document.body.style.background = 'rgb(95, 119, 200)';
        spinner.removeAttribute('hidden');
        rootElement.style.height = '30%';
        rootElement.style.alignItems = 'baseline';
        let weatherData;
        fetch(`http://api.weatherapi.com/v1/current.json?key=bc01654e446444bd9fa122536232003&q=${text}&aqi=no`)
          .then((response) => response.json())
          .then((data1) => {
            weatherData = data1;
            datalist.innerHTML = '';
            rootElement.style.height = '30%';
            fetch(`https://api.pexels.com/v1/search?query=${text.split(',')[0]}&per_page=1`, {
              headers: {
                Authorization: 'a6jgO2UOxPiyzNNf3iFHHjHtYol0y2sJrDkY7fBGw8Ydspe5vTGsjFpF',
              },
            })
              .then((resp) => {
                return resp.json();
              })
              .then((data) => {
                rootElement.insertAdjacentHTML('beforeend', weatherElement(weatherData));
                const icon = document.getElementById('star');
                if (data.photos.length) {
                  document.getElementById('weather').style.display = 'none';
                  const img = new Image();
                  img.src = data.photos[0].src.original;
                  img.addEventListener('load', function () {
                    spinner.setAttribute('hidden', '');
                    document.body.style.backgroundImage = `url(${img.src})`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundRepeat = 'no-repeat';
                    document.body.style.backgroundPosition = 'center center';
                    rootElement.style.height = '60%';
                    rootElement.style.alignItems = 'baseline';
                    document.getElementById('weather').style.display = 'flex';
                  });
                } else {
                  spinner.setAttribute('hidden', '');
                  rootElement.style.height = '60%';
                }
                if (favorites.includes(inputField.value)) {
                  icon.checked();
                }
                document.getElementById('favoritebutton').addEventListener('click', function () {
                  const fullNameOfCity = `${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`;
                  if (icon.classList.contains('fa-solid')) {
                    favorites.splice(favorites.indexOf(fullNameOfCity), 1);
                    icon.unchecked();
                    datalist.innerHTML = '';
                  } else {
                    icon.checked();
                    favorites.push(fullNameOfCity);
                  }
                });
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      }
    }
  });
  inputField.addEventListener('focus', function () {
    options = [];
    inputField.value = '';
    datalist.innerHTML = '';
    favorites.forEach(function (item) {
      const option = document.createElement('option');
      option.value = item;
      datalist.appendChild(option);
    });
  });
};

window.addEventListener('load', loadEvent);
