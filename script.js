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

function onFormSubmit(event){
    event.preventDefault();
    var originInput = origin.value;
    var destinationInput = destination.value;
    var startDateInput = startDate.value;
    var endDateInput = endDate.value;
    var budgetInput = budget.value;
    originCode = "LAX"; //getAirportCode(origin.value);
    destinationCode = "LON"; //getAirportCode(destination.value);
    console.log("Searching origin=" + originInput);
    console.log("Searching destination=" + destinationInput);
    //getFlight(originCode, destinationCode);
    //Save search data
    //saveUserInput(origin, destination, startDate, endDate, budget);
    console.log("origin="+originCode, "destination="+destinationCode, "startDate="+startDateInput, "endDate="+endDateInput, "budget="+budgetInput);
displayResults ();
}
function displayResults (){}

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
var requestUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query='+ destination;
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