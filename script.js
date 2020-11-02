//1.Make Search input
//2.make search button
//3.add event listener for button click that calls weatherapi
//4. make a card/div/element/some home for the current data on the web page
// -- current card needs to show: presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//5. for UV index: presented with a color that indicates whether the conditions are favorable, moderate, or severe
//6. make card/div/element for future 5 day weather cast
// -- future 5 day card needs to show: displays the date, an icon representation of weather conditions, the temperature, and the humidity
//need to set up local storage and userInput

//declaring variables
var searchButton = document.getElementById("search-button");
// var userInput = document.getElementById("")
var apiKey = "1d11cd9fa7c01b9a2502e818bcb69115"; //my openweatherapi key

// var cityName = document.getElementById("name");
var cityName;
var cityLat;
var cityLon;

var previousCities = [];

//button event listener that calls the openweatherapi function
searchButton.addEventListener("click", getCityWeather);

//function to get openweatherapi data
function getCityWeather(event) {
  event.preventDefault();

  cityName = document.getElementById("search-input").value;
  console.log(cityName);

  localStorage.setItem("previous" + previousCities.length, cityName);

  previousCities.push("previous" + previousCities.length + "");
  console.log(previousCities[0]);
  updatePreviousCities();

  //fetching openweatherapi data for current weather
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial&appid=" +
      apiKey
  )
    .then((response) => response.json())
    //call to function
    .then((data) => currentDataDisplay(data))
    .catch((error) => {
      throw new Error("City Doesnt Exist");
    });

  function currentDataDisplay(data) {
    //declaring variables to display data
    var cityName = data.name;
    var cityHumidity = data.main.humidity;
    var cityWind = data.wind.speed;
    var cityTemp = data.main.temp;

    //UV index fetch
    fetch(
      "http://api.openweathermap.org/data/2.5/uvi?q" +
        "&lat=" +
        data.coord.lat +
        "&lon=" +
        data.coord.lon +
        "&appid=" +
        apiKey
    )
      .then((response) => response.json())
      //call to function
      .then((data) => currentUVDisplay(data));

    //declaring variablese that call the html IDs
    var stateName = document.getElementById("name");
    var humidity = document.getElementById("humidity");
    var wind = document.getElementById("wind");
    var temp = document.getElementById("temp");

    //putting api data into webpage
    stateName.innerText = cityName;
    humidity.innerText = "Humidity: " + cityHumidity;
    wind.innerText = "Wind Speed: " + cityWind;
    temp.innerText = "Current Temperature: " + cityTemp;
  }

  function currentUVDisplay(data) {
    var cityUV = data.value;
    var uv = document.getElementById("uv");
    uv.innerText = "UV Index: " + cityUV;
  }

  function updatePreviousCities () {

    var cityDiv = document.getElementById('previousCities');
    
    //clearing children out 
    while (cityDiv.firstChild) {
      cityDiv.removeChild(cityDiv.firstChild);
    }

    for(i = 0; i < previousCities.length; i++) {
      var prevCity = localStorage.getItem(previousCities[i]);
      var prevCityDiv = document.createElement('div');

      prevCityDiv.textContent = prevCity;
      cityDiv.appendChild(prevCityDiv);
    }
  }

}
// console.log(searchButton);
