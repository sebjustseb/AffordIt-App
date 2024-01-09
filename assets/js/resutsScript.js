var resultDiv = document.querySelector("#result");
var isAffordable = false;
var destination = "";

function displayResult() {
    if(isAffordable){
        resultDiv.textContent = "Yes you can afford to go! Start packing for " + destination;
    } else {
        resultDiv.textContent = "Sorry keep saving...";
    }
}

// Reads if successful from local storage and returns array user input.
// Returns an empty array ([]) if there aren't any items.
function readSavedSearchFromStorage() {
    var search = localStorage.getItem('search');
    console.log(search);
    if (search) {
      search = JSON.parse(search);
      console.log(search);
      isAffordable = search[0].canAfford;
      destination = search[0].endCity;
      console.log(isAffordable);

      displayResult();
    } else {
      search = [];
    }
    return search;
}

readSavedSearchFromStorage();