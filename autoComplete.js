// BH_Lin@20130730
// define element by using.
var gTZ = null;
var mSearchField ;
var mResultText;
var mSubmiteButton;


var TIMEZONE_FILE = document.location.href.replace("autoComplete.html", "") + 'tz.json';

// initializing ... 
function init() {
	console.log("+ init");
	mSearchField = document.getElementById('searchField');
	mSearchField.onkeyup = onSearchTextChange;
	mResultText = document.getElementById('resultText');
	mSubmiteButton = document.getElementById('SubmitButton');

	if(document.location.protocol.indexOf("http") != -1) {
		console.log("load tz.json");
		loadJSON(TIMEZONE_FILE, function(response) {
			gTZ = JSON.parse(response);
			updateResult("");
		});	
	} else {
		console.log("load tz.js");
		gTZ = tzJson;
	}
	
}

function replaceSearchText(text) {
	console.log("+ replaceSearchText: " + text);
	mSearchField.value = text;
}

// update result 
function updateResult(result) {
	
	result.sort();
	
	mResultText.innerHTML = "";
	mResultText.innerHTML += "<ul>";
	var i;
	for(i=0; i< result.length; i++) {
		mResultText.innerHTML += "<li onclick='replaceSearchText(\"" + result[i] + "\")'>" + result[i] + "</li>";		
	}
	mResultText.innerHTML += "</ul>";
	if(result.length < 1) {
		mSubmiteButton.disabled=true;
	} else {
		mSubmiteButton.disabled=false;
	}
}

var searchText = "";
var searchResult = [];
var dataString="";
var resultText = "";
function onSearchTextChange() {
	console.log("+ onSearchTextChange: _" + mSearchField.value + "_");
	searchText = mSearchField.value;
	
	searchResult = [];

	searchText = searchText.toLowerCase();
	if(searchText.trim().length < 1) {
		updateResult(searchResult);
		return;
	}

	var continets = Object.keys(gTZ);
	var co =0,ci =0;
	dataString = "";
	for(co=0; co < continets.length; co ++) {
		for(ci=0; ci < gTZ[continets[co]].length ; ci ++) {
			dataString = gTZ[continets[co]][ci].city.toLowerCase();
			if(dataString.indexOf(searchText) != -1) {
				var hitItem = gTZ[continets[co]][ci];
				hitItem.continet = continets[co];
				searchResult.push(hitItem.city);
			}
		}
	}

	resultText = JSON.stringify(searchResult);
	console.log("Search Result: ", searchResult.length);
	updateResult(searchResult);
}

function loadJSON(href, callback) {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', href, true);
    //xhr.responseType = "json";
    xhr.onerror = callback;
    xhr.onload = function() {
      callback(xhr.response);
    };
    xhr.send();
}

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    init();
},false);