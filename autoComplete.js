
// Author: BH_Lin@20130730, optimized 2025
let gTZ = null;
let searchField, resultTextDiv, submitButton;
const TIMEZONE_FILE = document.location.href.replace("autoComplete.html", "") + 'tz.json';

function init() {
	searchField = document.getElementById('searchField');
	resultTextDiv = document.getElementById('resultText');
	submitButton = document.getElementById('SubmitButton');

	searchField.addEventListener('input', onSearchTextChange);
	resultTextDiv.addEventListener('click', onResultClick);

	if (document.location.protocol.startsWith('http')) {
		loadJSON(TIMEZONE_FILE, function(response) {
			gTZ = JSON.parse(response);
			updateResult([]);
		});
	} else {
		gTZ = typeof tzJson !== 'undefined' ? tzJson : {};
		updateResult([]);
	}
}

function onResultClick(e) {
	if (e.target && e.target.matches('li[data-city]')) {
		replaceSearchText(e.target.getAttribute('data-city'));
	}
}

function replaceSearchText(text) {
	searchField.value = text;
	onSearchTextChange();
	searchField.focus();
}

function updateResult(result) {
	result.sort();
	resultTextDiv.innerHTML = '';
	if (result.length > 0) {
		const ul = document.createElement('ul');
		ul.setAttribute('role', 'listbox');
		result.forEach(city => {
			const li = document.createElement('li');
			li.textContent = city;
			li.setAttribute('data-city', city);
			li.setAttribute('tabindex', '0');
			li.setAttribute('role', 'option');
			ul.appendChild(li);
		});
		resultTextDiv.appendChild(ul);
		submitButton.disabled = false;
	} else {
		submitButton.disabled = true;
	}
}

function onSearchTextChange() {
	const searchText = searchField.value.trim().toLowerCase();
	let searchResult = [];
	if (!gTZ || searchText.length < 1) {
		updateResult([]);
		return;
	}
	Object.keys(gTZ).forEach(continent => {
		gTZ[continent].forEach(item => {
			if (item.city.toLowerCase().includes(searchText)) {
				searchResult.push(item.city);
			}
		});
	});
	updateResult(searchResult);
}

function loadJSON(href, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', href, true);
	xhr.onerror = function() { callback({}); };
	xhr.onload = function() {
		callback(xhr.response);
	};
	xhr.send();
}

window.addEventListener('DOMContentLoaded', init);