
const divElement = function (content){
  return `<div>${content}</div>`;
};
const imgElement = function (source) {
  return `<img src=${source}>`;
};
const videoElement = function (source){
  return `<iframe width="600"
  height="400"
  src=${source}></iframe>`;
}

const apiKey = 'yM3w1ATFdMmMZiNZKq8h6qARRotKc1lzxTPDAagC';

const getNASAPicture = async () => {
  const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=';
  const response = await fetch(apiUrl + apiKey);
  const data = await response.json();
  return data;
};

const rootElement = function () {
  return document.getElementById('root');
};
const displayData = ((data) => {

  data.media_type === 'image' ? 
   rootElement().insertAdjacentHTML('afterbegin', imgElement(data.url)) :
   rootElement().insertAdjacentHTML('afterbegin', videoElement(data.url));

   rootElement().insertAdjacentHTML('afterbegin', divElement(data.title));
   rootElement().insertAdjacentHTML('beforeend', divElement(data.explanation));
});

const loadEvent = function() {
  getNASAPicture()
    .then((data) => {
      return displayData(data);
    }).then((data) => {
      console.log(data);
    })
    .catch(err => console.log(err));
};
window.addEventListener('load', loadEvent);
