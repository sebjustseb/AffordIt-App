var resultDiv = document.querySelector("#result");
var hideDiv = document.getElementById('formSection');
var origin = document.querySelector('#origin');
var destination = document.querySelector('#destination');
var startDateEl = document.querySelector('#startDate');
var endDateEl = document.querySelector('#endDate');
var budget = document.querySelector('#budget');
var searchBtn = document.querySelector('#search');
var form = document.getElementById('#form');

var destinationCode = '';
var originCode = '';


function displayResult(isAffordable) {
    if(isAffordable){
        resultDiv.textContent = "Yes you can afford to go! Start packing for " + destination;
    } else {
        resultDiv.textContent = "Sorry keep saving...";
    }
}

// Reads if successful from local storage and returns array user input.
// Returns an empty array ([]) if there aren't any items.
async function readSavedSearchFromStorage() {
    var search = localStorage.getItem('search');
    console.log(search);
    if (search) {
      search = JSON.parse(search);
      console.log(search);
      isAffordable = search[0].canAfford;
      destination = search[0].endCity;
      console.log(isAffordable);

      displayResult(isAffordable);
    } else {
      search = [];
    }
    return search;
}



//Locally store User Input used to search
function saveUserInput(originCity, destinationCity, startDate, endDate, budget, isAffordable) {

	var newSearch = {
		startCity: originCity,
		endCity: destinationCity,
		startDate: startDate,
		endDate: endDate,
		budget: budget,
		canAfford: isAffordable,
	  }
  
	  // add item to local storage
	  var search = [];
	  search.push(newSearch);
	  localStorage.setItem('search', JSON.stringify(search));

}

// Function used to get destination code for Hotels
async function getDestId(destination) {
	var url = 'https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=en-us&name=' + destination;
	console.log("Hotel dest_id = "+destination);
	var options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'b9f78922d5mshc75b0c6677706e0p107799jsn443ba8bf4077',
			'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
		}
	};

	try {
		var response = await fetch(url, options);
		var result = await response.json();
		console.log(result);
		bookDestId = result[0].dest_id;
		console.log('destID= '+ bookDestId);
		
		return bookDestId;
	} catch (error) {
		console.error(error);
	}
}

//Get Hotel id for cheapest hotel for the specific dates
async function getHotelId(bookDestId){
	console.log(startDateEl.value, endDateEl.value);
	var startDate = dayjs(startDateEl.value).format('YYYY-MM-DD');
	var endDate = dayjs(endDateEl.value).format('YYYY-MM-DD');
	console.log(bookDestId);
	var url = 'https://booking-com.p.rapidapi.com/v2/hotels/search?order_by=price&dest_id='+bookDestId+'&dest_type=city&checkin_date='+startDate+'&locale=en-gb&units=metric&filter_by_currency=USD&checkout_date='+endDate+'&adults_number=1&room_number=1&page_number=0&categories_filter_ids=class%3A%3A2%2Cclass%3A%3A4%2Cfree_cancellation%3A%3A1&include_adjacency=true';
	console.log(url);
	var options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'b9f78922d5mshc75b0c6677706e0p107799jsn443ba8bf4077',
			'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
		}
	};

	try {
		var response = await fetch(url, options);
		var result = await response.json();
		console.log(result);
		bookHotelId = result.results[0].id;
		console.log('hotelId= '+ bookHotelId);
		
		return bookHotelId;
	} catch (error) {
		console.error(error);
	}
}

//Calculate hotel price by adding the amount of days and price per day
async function getHotelPrice(bookHotelId) {
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
			'X-RapidAPI-Key': 'b9f78922d5mshc75b0c6677706e0p107799jsn443ba8bf4077',
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
			
				console.log( key );
				console.log( m[key] );
					total+=m[key];
				}
			}
			count++;
		})
		console.log(total);
		hotelPrice = total;
		return total;
	} catch (error) {
		console.error(error);
	}
}

async function getTotalHotelPrice(destInput) {
	console.log(destInput);
	console.log("Searching destination=" + destInput);
	var destId = await getDestId(destInput);
	var hotelId = await getHotelId(destId);
	var hotelPrice = await getHotelPrice(hotelId);
	console.log('USD ' + hotelPrice);

	return hotelPrice;
}

async function getFlightPrice(originValue, destValue, startDateValue, endDateValue){
	console.log("getting codes");
	console.log(originValue);
	
	originCode = await getAirportCode(originValue);
	console.log(destValue);
	destinationCode = await getAirportCode(destValue);
	console.log("codes found?");

	var bestFlightPrice = await getFlight(originCode, destinationCode, startDateValue, endDateValue, 'PRICE', 1, 'USD');
	//getFlight('BOM', 'DEL', '2024-01-18', '2024-01-22', 'PRICE', 1, 'USD');
	return bestFlightPrice;

}

//Function called when the Search is initiated
async function onFormSubmit(event){
	event.preventDefault();
	var originInput = origin.value;
	var destinationInput = destination.value;
	var startDateInput = startDateEl.value;
	var endDateInput = endDateEl.value;
	var budgetInput = budget.value;

	var flightPrice = await getFlightPrice(originInput, destinationInput, startDateInput, endDateInput);
	var totalHotelPrice = await getTotalHotelPrice(destinationInput);

	var isAffordable = await getAffordability(budgetInput, flightPrice, totalHotelPrice);

	if(isAffordable != "undefined") {
		//Save search data localy
		saveUserInput(originInput, destinationInput, startDateInput, endDateInput, budgetInput, isAffordable);
		
		resultDiv.textContent = "";
		hideDiv.style.display = "none";
		readSavedSearchFromStorage();
	}
}

async function getAffordability(budget, fPrice, hPrice){
	var totalCost = hPrice + fPrice;
	console.log("totalCost=" + totalCost);

	if(budget > totalCost){
		return true;
	} else{
		return false;
	}
}


async function getFlight(sourceAirportCode, destinationAirportCode, date, returnDate, sortOrder, numAdults, currencyCode) {
	//var flights = []
	const url = `https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?per_page=1&sourceAirportCode=${sourceAirportCode}&destinationAirportCode=${destinationAirportCode}&date=${date}&itineraryType=ROUND_TRIP&sortOrder=${sortOrder}&numAdults=${numAdults}&numSeniors=0&classOfService=ECONOMY&returnDate=${returnDate}&pageNumber=1&currencyCode=${currencyCode}`;
	//var flightResults = data.flights.purchaseLinks.totalPrice
	console.log(url);
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '03e2f74d48mshb5f241feb218003p100a24jsnb34818a016f4',
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
			if (result.data && result.data.flights && result.data.flights.length  > 0) {
				var totalPrice = result.data.flights[0].purchaseLinks[0].totalPrice;
				//totalPrice.push(totalPrice);
			};
			console.log(totalPrice);
			return totalPrice;
		} else {
			// Log the error status and status text
			console.error(`Error: ${response.status} - ${response.statusText}`);
		}

	
	} catch (error){
		console.error(error);
	}
}

async function getAirportCode(destination){
	var requestUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query=' + destination;

	console.log("Searching destination=" + destination);

	var options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '03e2f74d48mshb5f241feb218003p100a24jsnb34818a016f4',
			'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
		}
	};
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
}

searchBtn.addEventListener("click", onFormSubmit);