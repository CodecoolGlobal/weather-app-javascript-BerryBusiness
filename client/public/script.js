const welcomeElement = function () {
  return `<div id="searchbar">
  <i class="fa-sharp fa-solid fa-location-dot" style="color: #64c3f6"></i>
  <input list="cities" id="inputField" name="inputField" placeholder="Enter your location" type="search">
  <datalist id="cities"></datalist>
  <button id="search"><i class="fa-solid fa-magnifying-glass"></i></button>
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

const loadEvent = function () {
  const rootElement = document.getElementById('root');
  rootElement.insertAdjacentHTML('beforeend', welcomeElement());
  rootElement.insertAdjacentHTML('beforeend', '<div hidden id="spinner"></div>');
  const inputField = document.getElementById('inputField');
  const datalist = document.getElementById('cities');
  const searchButton = document.getElementById('search');
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
            if (option.hasOwnProperty('region')) {
              return `${option.name}, ${option.region}, ${option.country}`;
            }
            return `${option.name}, ${option.country}`;
          });
          options.forEach(function (item) {
            const option = document.createElement('option');
            option.value = item;
            datalist.appendChild(option);
          });
          if (data.length === 1){
            datalist.innerHTML = '';
            inputField.value = `${data['0'].name}, ${data['0'].region}, ${data['0'].country}`;
          }
        })
        .catch((error) => console.error(error));
    }
  });
  searchButton.addEventListener('click', function () {
    const text = inputField.value;
    if (options.length === 1) {
      document.body.style.background = 'rgb(95, 119, 200)';
      spinner.removeAttribute('hidden');
      rootElement.style.height = '30%';
      rootElement.style.alignItems = 'baseline';
      fetch(`https://api.pexels.com/v1/search?query=${text.split(',')[0]}&per_page=1`, {
        headers: {
          Authorization: 'a6jgO2UOxPiyzNNf3iFHHjHtYol0y2sJrDkY7fBGw8Ydspe5vTGsjFpF',
        },
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          if (data.photos.length) {
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
              fetch(`http://api.weatherapi.com/v1/current.json?key=bc01654e446444bd9fa122536232003&q=${text}&aqi=no`)
                .then((response) => response.json())
                .then((data1) => {
                  rootElement.insertAdjacentHTML('beforeend', weatherElement(data1));
                  const icon = document.getElementById('star');
                  if (favorites.includes(inputField.value)) {
                    icon.classList.remove('fa-regular');
                    icon.classList.remove('fa-star');
                    icon.classList.add('fa-solid');
                    icon.classList.add('fa-star');
                  }
                  const favoriteButton = document.getElementById('favoritebutton');
                  favoriteButton.addEventListener('click', function () {
                    if (icon.classList.contains('fa-solid')) {
                      favorites.splice(favorites.indexOf(`${data1.location.name}, ${data1.location.country}`), 1);
                      icon.classList.remove('fa-solid');
                      icon.classList.remove('fa-star');
                      icon.classList.add('fa-regular');
                      icon.classList.add('fa-star');
                      datalist.innerHTML = '';
                    } else {
                      icon.classList.remove('fa-regular');
                      icon.classList.remove('fa-star');
                      icon.classList.add('fa-solid');
                      icon.classList.add('fa-star');
                      favorites.push(`${data1.location.name}, ${data1.location.country}`);
                      favorites.forEach(function (item) {
                        const option = document.createElement('option');
                        option.value = item;
                        datalist.appendChild(option);
                      });
                    }
                  });
                })
                .catch((error) => console.error(error));
            });
          } else {
            spinner.setAttribute('hidden', '');
            rootElement.style.height = '60%';
            fetch(`http://api.weatherapi.com/v1/current.json?key=bc01654e446444bd9fa122536232003&q=${text}&aqi=no`)
              .then((response) => response.json())
              .then((data1) => {
                rootElement.insertAdjacentHTML('beforeend', weatherElement(data1));
                const icon = document.getElementById('star');
                if (favorites.includes(inputField.value)) {
                  icon.classList.remove('fa-regular');
                  icon.classList.remove('fa-star');
                  icon.classList.add('fa-solid');
                  icon.classList.add('fa-star');
                }
                const favoriteButton = document.getElementById('favoritebutton');
                favoriteButton.addEventListener('click', function () {
                  if (icon.classList.contains('fa-solid')) {
                    favorites.splice(favorites.indexOf(`${data1.location.name}, ${data1.location.region}, ${data1.location.country}`), 1);
                    icon.classList.remove('fa-solid');
                    icon.classList.remove('fa-star');
                    icon.classList.add('fa-regular');
                    icon.classList.add('fa-star');
                    datalist.innerHTML = '';
                  } else {
                    icon.classList.remove('fa-regular');
                    icon.classList.remove('fa-star');
                    icon.classList.add('fa-solid');
                    icon.classList.add('fa-star');
                    favorites.push(`${data1.location.name}, ${data1.location.region}, ${data1.location.country}`);
                    favorites.forEach(function (item) {
                      const option = document.createElement('option');
                      option.value = item;
                      datalist.appendChild(option);
                    });
                  }
                });
              })
              .catch((error) => console.error(error));
          }
        });
    }
  });
  inputField.addEventListener('click', function () {
    datalist.innerHTML = '';
    if (inputField.value !== '') {
      inputField.value = '';
    }
    options = [];
  });
};

window.addEventListener('load', loadEvent);
