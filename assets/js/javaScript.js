var flightTableBody = document.querySelector('#flight-container-info')

//ON CLICK OF SUBMIT BUTTON
$("#search-btn").on("click", function () {

	//empty out flight table where flights are displayed
	$("#flight-container-info").empty();

	//API Params
	var currency = "USD"
	var language = "en-US"
	var country = "US"

	//grabs outbound date of form
	var outboundDate = $("#outboundDate").val()
	console.log(outboundDate)
	if (outboundDate == "") {
		alert("Please enter in a OutBound Date")
		return
	}
	//grabs return date of form
	var returnDate = $('#returnDate').val()
	console.log(returnDate)
	if (returnDate == "") {
		alert("Please enter in a Return Date")
		return
	}
	//grabs origin of form
	var origin = $('#Origin').val()
	console.log(origin)
	if (origin == "") {
		alert("Please enter in an origin")
		return
	}
	//grabs destination of form
	var destination = $('#Destination').val()
	console.log(destination)
	if (destination == "") {
		alert("Please enter in a Destination")
		return
	}


	//throws inputs into API 
	//SKYSCANNER API that returns routes from an origin to a destination at a specific date 
	fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/" + country + "/" + currency + "/" + language + "/" + origin + "/" + destination + "/" + outboundDate + "?inboundpartialdate=" + returnDate, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
			"x-rapidapi-key": "dae9f598fbmsh6d16f4dfa6f12a7p1e4403jsnee920035895e"
		}
	})
		.then(response => response.json())
		.then(data => showFlights(data))
});

var showFlights = function (data) {

	console.log(data.Quotes.length)

	for (var i = 0; i < data.Quotes.length; i++) {


		for (let x = 0; x < data.Places.length; x++) {
			// Grabs Origin Airport
			if (data.Places[x].PlaceId === data.Quotes[i].OutboundLeg.OriginId) {
				var originAirport = data.Places[x].IataCode;
				var originCity = data.Places[x].CityName;
				
			}

			// Grabs Destination Airport
			if (data.Places[x].PlaceId === data.Quotes[i].OutboundLeg.DestinationId) {
				var destinationAirport = data.Places[x].IataCode;
				var destinationCity = data.Places[x].CityName;
			}
		}

		var price = data.Quotes[i].MinPrice

		for (let y = 0; y < data.Carriers.length; y++) {
			// Grabs Airline Carrier
			if (data.Carriers[y].CarrierId === data.Quotes[i].OutboundLeg.CarrierIds[0]) {
				var airlineCarrier = data.Carriers[y].Name;
			}
		}

		var flightContainer = document.createElement("tr");
		flightContainer.setAttribute('class', 'hoverable');

		//creates origin flight info and adds to flight container
		var flightOrigin = document.createElement("td");
		flightOrigin.textContent = originCity + " (" + originAirport + ")"
		flightContainer.append(flightOrigin);

		//creates destination flight info and adds to flight container
		var flightDestination = document.createElement("td");
		flightDestination.textContent = destinationCity + " (" + destinationAirport + ")"
		flightContainer.append(flightDestination);

		//creates departure time and adds to flight container
		var departureTime = document.createElement("td");
		departureTime.textContent = "9:00AM"
		flightContainer.append(departureTime);

		//creates carrier name and adds to flight container
		var carrierName = document.createElement("td");
		carrierName.textContent = airlineCarrier
		flightContainer.append(carrierName);

		//creates price and adds to flight container
		var flightPrice = document.createElement("td");
		flightPrice.textContent = '$' + price + '.00'
		flightContainer.append(flightPrice);


		//appends flight info into table
		flightTableBody.append(flightContainer);
		
	}
}

// ----- Five day forecast of destination section using saved city name, execute a 5-day forecast get request from open weather api ------


// makes array from local storage 
var searchCityName = JSON.parse(localStorage.getItem('City Name')) || [];
var forecastEl = $('#forecast-container')
var forecastTitle = $('#forecast-title')

var apiKey = "f3c6f7687f7f43a162f3912305630533"


// filters array for unique values
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var unique = searchCityName.filter(onlyUnique);


// when 'Search' button is clicked
$("#search-btn").on("click", function () {

// empty out flight table where flights are displayed 
$("#forecast-container").empty();

// grabs cityName from destination form
	var cityName = $('#Destination').val()
	// console.log(cityName);
	if (cityName == "") {
		alert("Please enter in a Destination")
		return
	}

// sends fetch to openweather map
  fetchWeatherData(cityName)
  //console.log(cityName)
});

var fetchWeatherData = function (cityName) {
  // console.log(cityName);
  // sends fetch to openweather map
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          //Five day forecast
          FiveDayForecast(data)  
        });

	// saves search into array
        
        searchCityName.push(cityName)
		console.log(cityName);
		

	// pushes array into localstorage 
        saveSearch(); 

		}
	})
}
	
// saves searches into local storage
var saveSearch = function () {
	localStorage.setItem('City Name', JSON.stringify(searchCityName));
}

// display five day forecast
var FiveDayForecast = function (weather) {

  
	for (i = 5; i < weather.list.length; i = i + 8) {
	  var forecastCard = document.createElement('div')
	  forecastCard.setAttribute('class', 'card col-md-2 border forecastCard')
  
	  //Gets date for each day
	  var forecastDate = document.createElement('h6')
	  forecastDate.textContent = moment.unix(weather.list[i].dt).format("MMM D, YYYY");
	  forecastCard.append(forecastDate)
  
	  //Gets Image for each day
	  var forecastImage = document.createElement('img')
	  forecastImage.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`)
	  forecastCard.append(forecastImage)
  
	  //Gets Temp for each day
	  var forecastTemp = document.createElement('p')
	  forecastTemp.textContent = 'Temp: ' + weather.list[i].main.temp + '°F'
	  forecastCard.append(forecastTemp)
  
	  //Gets Wind for each day
	  var forecastWind = document.createElement('p')
	  forecastWind.textContent = 'Wind: ' + weather.list[i].wind.speed + 'MPH';
	  forecastCard.append(forecastWind)
  
	  //Gets Humidity for each day
	  var forecastHumidity = document.createElement('p')
	  forecastHumidity.textContent = 'Humidity: ' + weather.list[i].main.humidity + '%'
	  forecastCard.append(forecastHumidity)
  
	  //Appends Forecast Card to Forecast Container
	  forecastEl.append(forecastCard)
	}
  
  }
 
  fetchWeatherData(cityName)









