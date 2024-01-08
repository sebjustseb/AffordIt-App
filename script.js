//main focus is to make sure we are acquiring data from our API
var origin = document.querySelector('#origin');
var destination = document.querySelector('#destination');
var startDate = document.querySelector('#startDate');
var endDate = document.querySelector('#endDate');
var budget = document.querySelector('#budget');
var searchBtn = document.querySelector('#search');
var form = document.getElementById('#form');

var destinationCode = '';
var originCode = '';

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
		var destId = result[0].dest_id;
		console.log('destID= '+ destId);
		return destId;
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
	destId = getDestId(destinationInput); //hotel dest_Id (booking)
	console.log('Hi Sebastian');
	console.log(destinationInput);
	console.log("Searching origin=" + originInput);
	console.log("Searching destination=" + destinationInput);
	getFlight(originCode, destinationCode);
	console.log("Booking dest_ID for " + destinationInput);
	getDestId(destinationInput);

	//Save search data
	saveUserInput(originInput, originCode, destinationInput, destinationCode, startDateInput, endDateInput, budgetInput);
displayResults();
}
function displayResults (){
	console.log("Display Attempt")
		document.location.replace("./searchresults.html");}



function getFlight(){//source, destination, beginDate, returnDate){
	const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=BOM&destinationAirportCode=DEL&date=2024-01-18&itineraryType=ROUND_TRIP&sortOrder=PRICE&numAdults=1&numSeniors=0&classOfService=ECONOMY&returnDate=2024-01-22&pageNumber=1&currencyCode=USD';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b9f78922d5mshc75b0c6677706e0p107799jsn443ba8bf4077',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	}
};

(async () => {
		try {
			const response = await fetch(url, options);
			const result = await response.text();
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	})
}

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


//hotel function
//get dest_id (booking)

//use dest_id, dates to fetch hotel with lowest price
// function getHotel() {

// }
searchBtn.addEventListener("click", onFormSubmit);