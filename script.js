// Grabbing HTML //
var searchBarEl = $(".searchBar")
var cityChoiceEl = $("#cityChoice")
var cityListEl = $(".cityList")
var cityButtons = $(".cityButtons")
var cityInfoEl = $(".cityInfo")
var cityNameEl = $(".cityName")
var todaysDate = $(".date")
var todayImgEl = $(".todayImg")
var tempEl = $(".temp")
var humidEl = $(".humidity")
var windEl = $(".windSpeed")
var uvIndexEl = $(".uvIndex")
var forecastDate0 = $(".forecastDate0")
var forecastDate1 = $(".forecastDate1")
var forecastDate2 = $(".forecastDate2")
var forecastDate3 = $(".forecastDate3")
var forecastDate4 = $(".forecastDate4")
var forecastTemp0 = $(".forecastTemp0")
var forecastTemp1 = $(".forecastTemp1")
var forecastTemp2 = $(".forecastTemp2")
var forecastTemp3 = $(".forecastTemp3")
var forecastTemp4 = $(".forecastTemp4")
var forecastHumidity0 = $(".forecastHumidity0")
var forecastHumidity1 = $(".forecastHumidity1")
var forecastHumidity2 = $(".forecastHumidity2")
var forecastHumidity3 = $(".forecastHumidity3")
var forecastHumidity4 = $(".forecastHumidity4")
var currentCities = []

// Function: Requesting Weather Info and Populating Site //
var getWeather = function (city) {

    // Current Weather API //
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bdf166e3737ee21dc0f6661d8925ff12`;

    $.get(requestUrl).then(function (data) {

        var cityName = data.name

     
        // Event Listener: City Buttons // 

        // Populating Chosen City's Info On Page //
        cityNameEl.text(cityName);

        todaysDate.text(moment().format("M / D / YYYY"));

        var iconcode = data.weather[0].icon
        var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        todayImgEl.attr("src", iconUrl);

        var fTemp = (((data.main.temp) - 273.15) * 9/5 + 32)
        tempEl.text("Temperature: " + fTemp.toFixed(2) + " ˚F")

        humidEl.text("Humidity: " + `${data.main.humidity}` + " %");

        windEl.text("Wind Speed: " + `${data.wind.speed}` + " MPH");

        // UV Index API //
        var lat = data.coord.lat
        var lon = data.coord.lon
        var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=bdf166e3737ee21dc0f6661d8925ff12&lat=" + lat + "&lon=" + lon
        $.get(uvUrl).then(function (uv) {
        uvIndexEl.text("UV Index: " + uv.value)
        if (uv.value <= 2){
            uvIndexEl.attr("id", "green")
        } else if (uv.value <= 5 && uv.value >= 3) {
            uvIndexEl.attr("id", "yellow")
        } else {
            uvIndexEl.attr("id", "red")
        }
        });

        // 5-Day Forecast API //
        var forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=bdf166e3737ee21dc0f6661d8925ff12`
        $.get(forecastUrl).then(function (forecast) {

            var tomorrow = moment().add(1, 'days')
            var dayAfter = moment().add(2, 'days')
            var dayAfter2 = moment().add(3, 'days')
            var dayAfter3 = moment().add(4, 'days')
            var dayAfter4 = moment().add(5, 'days')
            
            forecastDate0.text(tomorrow.format(`M / D / YYYY`))
            forecastDate1.text(dayAfter.format(`M / D / YYYY`))
            forecastDate2.text(dayAfter2.format(`M / D / YYYY`))
            forecastDate3.text(dayAfter3.format(`M / D / YYYY`))
            forecastDate4.text(dayAfter4.format(`M / D / YYYY`))

            $(".forecastImg0").attr("src","http://openweathermap.org/img/w/" + (forecast.list[0].weather[0].icon) + ".png")
            $(".forecastImg1").attr("src","http://openweathermap.org/img/w/" + (forecast.list[8].weather[0].icon) + ".png")
            $(".forecastImg2").attr("src","http://openweathermap.org/img/w/" + (forecast.list[16].weather[0].icon) + ".png")
            $(".forecastImg3").attr("src","http://openweathermap.org/img/w/" + (forecast.list[24].weather[0].icon) + ".png")
            $(".forecastImg4").attr("src","http://openweathermap.org/img/w/" + (forecast.list[32].weather[0].icon) + ".png")
            
            forecastTemp0.text("Temperature: " + (((forecast.list[0].main.temp) - 273.15) * 9/5 + 32).toFixed(2) + " ˚F")
            forecastTemp1.text("Temperature: " + (((forecast.list[8].main.temp) - 273.15) * 9/5 + 32).toFixed(2) + " ˚F")
            forecastTemp2.text("Temperature: " + (((forecast.list[16].main.temp) - 273.15) * 9/5 + 32).toFixed(2) + " ˚F")
            forecastTemp3.text("Temperature: " + (((forecast.list[24].main.temp) - 273.15) * 9/5 + 32).toFixed(2) + " ˚F")
            forecastTemp4.text("Temperature: " + (((forecast.list[32].main.temp) - 273.15) * 9/5 + 32).toFixed(2) + " ˚F")

            forecastHumidity0.text("Humidity: " + (forecast.list[0].main.humidity) + " %")
            forecastHumidity1.text("Humidity: " + (forecast.list[8].main.humidity) + " %")
            forecastHumidity2.text("Humidity: " + (forecast.list[16].main.humidity) + " %")
            forecastHumidity3.text("Humidity: " + (forecast.list[24].main.humidity) + " %")
            forecastHumidity4.text("Humidity: " + (forecast.list[32].main.humidity) + " %")
        });

        // Store City Name to Local Storage //
        localStorage.setItem("city", data.name)

        // Making City Info Visible On Screen (default hidden)//
        cityInfoEl.css("display", "block");
    });
};

// Load Locally Stored City To current city Array //
var lastCity = localStorage.getItem("city")
if(lastCity !== null){
    getWeather(lastCity)
    currentCities.push(lastCity)
    var cityButton = $("<button>");
    cityButton.addClass("large-4 button addedCity secondary");
    cityButton.attr("id", lastCity)
    cityButton.text(lastCity);
    cityListEl.prepend(cityButton)
}

// Event Listener: Run Function On Searched City //
searchBarEl.on("submit", function (event) {
    event.preventDefault();

    // Emptying cityList of Buttons //
    $(".cityList").empty();
    var cityChoice = cityChoiceEl.val().trim()

       // Ensuring currentCities Array Has No Repitions //
       if(!currentCities.includes(cityChoice)) {
        currentCities.push(cityChoice)
        }   

        for (let i = 0; i < currentCities.length; i++) {
        // Creating City Buttons From currentCities Array //
        var cityButton = $("<button>");
        cityButton.addClass("large-4 button addedCity secondary");
        cityButton.attr("id", currentCities[i])
        cityButton.text(currentCities[i]);
        cityListEl.prepend(cityButton); 
        }

    getWeather(cityChoice);
});

// Event Listener: Run Function On Past City Buttons //
cityListEl.on("click", function (event) {
    event.preventDefault();
    var cityToSearch = event.target.textContent
    getWeather(cityToSearch);
});
