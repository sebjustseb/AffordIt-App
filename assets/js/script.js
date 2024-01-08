//main focus is to make sure we are acquiring data from our API
var origin = document.querySelector('#origin');
var destination = document.querySelector('#destination');
var startDateEl = document.querySelector('#startDate');
var endDateEl = document.querySelector('#endDate');
var budget = document.querySelector('#budget');
var searchBtn = document.querySelector('#search');
var form = document.getElementById('#form');

var destinationCode = '';
var originCode = '';
var isAffordable = false;

//Locally store search info
function saveUserInput(originCity, originCode, destinationCity, destinationCode, startDate, endDate, budget) {

	var newSearch = {
		startCity: originCity,
		startCityCode: originCode,
		endCity: destinationCity,
		endCityCode: destinationCode,
		startDate: startDate,
		endDate: endDate,
		budget: budget,
		canAfford: isAffordable,
	  }
  
	  // add item to local storage
	  var search = []; //readSavedSearchFromStorage();
	  search.push(newSearch);
	  localStorage.setItem('search', JSON.stringify(search));

}

async function getDestId(destination) {
	var url = 'https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=en-us&name=' + destination;
	console.log("Hotel dest_id = ");
	var options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '57dfbe13d6msh55f96b9ca680f6dp1ff0e6jsnbea2c6477590',
			'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
		}
	};

	try {
		console.log('Hi Bryan');
		var response = await fetch(url, options);
		var result = await response.json();
		console.log(result);
		bookDestId = result[0].dest_id;
		console.log('destID= '+ bookDestId);
		bookHotelId = getHotelId();
		return bookDestId;
	} catch (error) {
		console.error(error);
	}
}


async function getHotelId(){
	console.log(startDateEl.value, endDateEl.value);
	var startDate = dayjs(startDateEl.value).format('YYYY-MM-DD');
	var endDate = dayjs(endDateEl.value).format('YYYY-MM-DD');
	console.log(bookDestId);
var url = 'https://booking-com.p.rapidapi.com/v2/hotels/search?order_by=price&dest_id='+bookDestId+'&dest_type=city&checkin_date='+startDate+'&locale=en-gb&units=metric&filter_by_currency=USD&checkout_date='+endDate+'&adults_number=1&room_number=1&page_number=0&categories_filter_ids=class%3A%3A2%2Cclass%3A%3A4%2Cfree_cancellation%3A%3A1&include_adjacency=true';
console.log(url);
var options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '57dfbe13d6msh55f96b9ca680f6dp1ff0e6jsnbea2c6477590',
		'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
	}
};

try {
	var response = await fetch(url, options);
	var result = await response.json();
	console.log(result);
	bookHotelId = result.results[0].id;
	console.log('hotelId= '+ bookHotelId);
	getHotelPrice();
	return bookHotelId;
} catch (error) {
	console.error(error);
}}

async function getHotelPrice() {
	console.log(startDate.value, endDate.value);
	startDate = dayjs(startDateEl.value).format('YYYY-MM-DD');
	endDate = dayjs(endDateEl.value).format('YYYY-MM-DD');
	var startDate2 = dayjs(startDate);
	var endDate2 = dayjs(endDate);
	console.log(startDate2, endDate2, bookHotelId);
	var url = 'https://booking-com.p.rapidapi.com/v2/hotels/calendar-pricing?currency_code=USD&locale=en-us&checkin_date='+ startDate +'&hotel_id='+ bookHotelId +'&adults_number=1&checkout_date='+ endDate;
	console.log(url);
	var duration = endDate2.diff(startDate2, 'days');
	console.log(duration + ' days');
	var options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '57dfbe13d6msh55f96b9ca680f6dp1ff0e6jsnbea2c6477590',
			'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
		}
	};

	try {
		var response = await fetch(url, options);
		var result = await response.json();
		console.log(result);
		var count = 0;
		var total = 0;
		bookHotelPrice = result.avDates;
		bookHotelPrice.forEach( function ( m ) {
			if (count < duration) { 
			for ( const key in m ) {
		  
			  console.log( key ); // "who"
			  console.log( m[key] ); // "Arthur"
				total+=m[key];
			}
			}
			count++;
		  })
		console.log(total);
		return bookHotelPrice;
	} catch (error) {
		console.error(error);
	}
}

function onFormSubmit(event){
	event.preventDefault();
	var originInput = origin.value;
	var destinationInput = destination.value;
	var startDateInput = startDate.value;
	var endDateInput = endDate.value;
	var budgetInput = budget.value;

	originCode = getAirportCode(origin.value);
	destinationCode = getAirportCode(destination.value);
	console.log('Hi Sebastian');
	console.log(destinationInput);
	console.log("Searching origin=" + originInput);
	console.log("Searching destination=" + destinationInput);
	getFlight(originCode, destinationCode);
	console.log("Booking dest_ID for " + destinationInput);
	bookDestId = getDestId(destinationInput);
	// bookHotelPrice = getHotelPrice();
	console.log('USD ' + bookHotelPrice);
	
	//Save search data
	saveUserInput(originInput, originCode, destinationInput, destinationCode, startDateInput, endDateInput, budgetInput);
displayResults();
}
function displayResults (){
	console.log("Display Attempt")
		// document.location.replace("./searchresults.html");}
}
async function getFlight(sourceAirportCode, destinationAirportCode, date, returnDate, sortOrder = 'PRICE', numAdults = 1, currencyCode = 'USD') {
	var flights = []
	const url = `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?per_page=1&sourceAirportCode=${sourceAirportCode}&destinationAirportCode=${destinationAirportCode}&date=${date}&itineraryType=ROUND_TRIP&sortOrder=${sortOrder}&numAdults=${numAdults}&numSeniors=0&classOfService=ECONOMY&returnDate=${returnDate}&pageNumber=1&currencyCode=${currencyCode}`;
	//var flightResults = data.flights.purchaseLinks.totalPrice
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '9b85801173msha3a8626ebe4a7b5p1f1cddjsn2391049db4e4',
			'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
		}
	};

	try {
		const response = await fetch(url, options);

		// Check if the response is successful (status code 2xx)
		if (response.ok) {
			const result = await response.json();
			//var priceCell.textContent = result[i].price;
			console.log(result);
			console.log(result.data.flights[0].purchaseLinks[0].totalPrice);
			if (result.data && result.data.length > 0) {
                // Iterate through the flights and push relevant data to the 'flights' array
                result.data.forEach(flight => {
                    flights.push({
                        airlinePrices: flight.prices,
					});
			})}
		} else {
			// Log the error status and status text
			console.error(`Error: ${response.status} - ${response.statusText}`);
		}

	
	} catch (error){
		console.error(error);
	}}


getFlight('BOM', 'DEL', '2024-01-18', '2024-01-22',);

function getAirportCode(destination){
var requestUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query=' + destination;

console.log("Searching destination=" + destination);

var options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '03e2f74d48mshb5f241feb218003p100a24jsnb34818a016f4',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	}
};
( async () => {
try {
	console.log("awaiting fetch...");
	var response = await fetch(requestUrl, options);
	var result = await response.json();
	var airportCode = result.data[0].airportCode;
	console.log(airportCode);
	return airportCode;
} catch (error) {
    console.error(error);
}
})();
}

searchBtn.addEventListener("click", onFormSubmit);