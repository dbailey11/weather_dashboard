//1.Make Search input
//2.make search button
//3.add event listener for button click that calls weatherapi
//4. make a card/div/element/some home for the current data on the web page
// -- current card needs to show: presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//5. for UV index: presented with a color that indicates whether the conditions are favorable, moderate, or severe
//6. make card/div/element for future 5 day weather cast
// -- future 5 day card needs to show: displays the date, an icon representation of weather conditions, the temperature, and the humidity


//declaring variables
var searchButton = document.getElementById("search-button");
var apiKey = '1d11cd9fa7c01b9a2502e818bcb69115' //my openweatherapi key
var cityName = "Denver"

//button event listener that calls the openweatherapi function
searchButton.addEventListener("click", getCityWeather);

//function to get openweatherapi data
function getCityWeather() {
    //maybe not right?
    // var searchInput = document.getElementById("search-input").value
    // console.log(searchInput);
    var currentDisplay = document.getElementById('currentDisplay');
    //fetching openweatherapi data
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey)
        .then(response => response.json())
        //call to function
        .then(data => currentDataDisplay(data))

    function currentDataDisplay(data) {
        //calls certiain values from data
        const {name, main, weather, wind,} = data;

        document.getElementById('name').textContent = name;
        document.getElementById('wind').textContent = wind

        // console.log(name);
        // console.log(main);
    } 
        
}
console.log(searchButton);