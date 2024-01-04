//main focus is to make sure we are acquiring data from our API



var requestUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query=london';
function getApi(url){


var options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '03e2f74d48mshb5f241feb218003p100a24jsnb34818a016f4',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	}
};

( async () => {
try {
	var response = await fetch(url, options);
	var result = await response.json();
	console.log(result);
} catch (error) {
	console.error(error);
}
})();
}

getApi(requestUrl);

// var requestUrl = '';

// var responseText = document.getElementById('response-text');

// function getApi(requestUrlArg) {
//   fetch(requestUrlArg)
//   .then(function (response) {
//     console.log(response);
//     if (response.status === 200) {
//       responseText.textContent = response.status;
//     }
//     return response.json();
//   });
// }

// getApi(requestUrl);

