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
  //whatever city user puts in
  cityName = document.getElementById("search-input").value;
  console.log(cityName);

  var cityExists = false;

  //loop to check already searched names and not repeat
  for (i = 0; i < previousCities.length; i++) {
    var currentCity = localStorage.getItem(previousCities[i]);
    if (currentCity == cityName) {
      cityExists = true;
    }
  }

  //setting user input to local storage with key
  if (!cityExists) {
    localStorage.setItem("previous" + previousCities.length, cityName);

    //putting searched city into array
    previousCities.push("previous" + previousCities.length + "");
  }
  // console.log(previousCities[0]);

  //calling function
  updatePreviousCities();

  //fetching openweatherapi data for current weather
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
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
      "https://api.openweathermap.org/data/2.5/uvi?q" +
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
    // console.log(data);

    //5 day forecast
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
        data.name +
        "&units=imperial&appid=" +
        apiKey
    )
      .then((response) => response.json())
      //call to function
      .then((data) => forecastDisplay(data))
      .catch((error) => {
        throw new Error("City Doesnt Exist");
      });

    //declaring variablese that call the html IDs
    var stateName = document.getElementById("name");
    var humidity = document.getElementById("humidity");
    var wind = document.getElementById("wind");
    var temp = document.getElementById("temp");

    //putting api data into webpage
    //getting current date and formatting
    var D = new Date();
    var dateString =
      " (" +
      (D.getUTCMonth() + 1) +
      "-" +
      D.getUTCDay() +
      "-" +
      D.getUTCFullYear() +
      ")";
    console.log(D.getFullYear());

    //setting all current weather features
    stateName.innerHTML =
      cityName +
      dateString +
      "<img src=' http://openweathermap.org/img/wn/" +
      data.weather[0].icon +
      ".png'>";
    humidity.innerText = "Humidity: " + cityHumidity;
    wind.innerText = "Wind Speed: " + cityWind;
    temp.innerText = "Current Temperature: " + cityTemp;
  }

  function currentUVDisplay(data) {
    var cityUV = data.value;
    var uv = document.getElementById("uvnum");
    uv.innerText = cityUV;

    //UV index badge color
    if (cityUV <= 3) {
      uv.style.backgroundColor = "green";
      uv.style.color = "white";
    } else if (cityUV >= 3 || cityUV <= 6) {
      uv.style.backgroundColor = "yellow";
      uv.style.color = "black";
    } else {
      uv.style.backgroundColor = "red";
      uv.style.color = "white";
    }
  }

  function updatePreviousCities() {
    var cityDiv = document.getElementById("previousCities");

    //clearing children out
    while (cityDiv.firstChild) {
      cityDiv.removeChild(cityDiv.firstChild);
    }

    //loop to display previous searched cities
    for (i = 0; i < previousCities.length; i++) {
      var prevCity = localStorage.getItem(previousCities[i]);
      var prevCityDiv = document.createElement("li");
      prevCityDiv.classList.add("item");

      prevCityDiv.addEventListener("click", function (event) {
        console.log(this.textContent);
        document.getElementById("search-input").value = this.textContent;
        getCityWeather(event);
      });

      //setting div to display city name
      prevCityDiv.textContent = prevCity;
      cityDiv.appendChild(prevCityDiv);
    }
  }

  function forecastDisplay(data) {
    var indexes = [];
    //pulls the current day--------------just day
    var currentDay = data.list[0].dt_txt.substring(8, 10);
    // console.log(currentDay);
    indexes.push(0);

    //loop through and just get data for each new day for forecast
    //to make sure data by day not hour displays
    //(8, 10) - just to get the days and not any of the other date info
    for (i = 0; i < data.list.length; i++) {
      if (data.list[i].dt_txt.substring(8, 10) !== currentDay) {
        indexes.push(i);
        currentDay = data.list[i].dt_txt.substring(8, 10);
      }
    }
    // console.log(indexes);

    //takes off extra day
    indexes.pop(indexes.length - 1);

    //loop to display 5 day forecast in each card
    for (i = 0; i < indexes.length; i++) {
      // console.log(data.list[indexes[i]]);

      var D = new Date();
      var dateString =
        " (" +
        (D.getUTCMonth() + 1) +
        "-" +
        D.getUTCDay() +
        "-" +
        D.getUTCFullYear() +
        ")";

      //cancatenation of all the data from the forecast api
      document.getElementById(i).innerHTML =
        dateString +
        "<br />" +
        "<img src=' http://openweathermap.org/img/wn/" +
        data.list[indexes[i]].weather[0].icon +
        ".png'>" +
        "<br />" +
        "Temp: " +
        data.list[indexes[i]].main.temp +
        "<br />" +
        "Humidity: " +
        data.list[indexes[i]].main.humidity;
    }
  }
}
// console.log(searchButton);
