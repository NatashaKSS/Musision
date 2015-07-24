var key = "userComposition";

// Checks if user's browser configuration accepts local storage
function supportsLocalStorage() {
	try {
	  return "localStorage" in window && window["localStorage"] !== null;
	} catch (error) {
	  return false;
	}
}

function writeSaveData() {
	try {
		localStorage.setItem(key, JSON.stringify(composition));
	} catch(error) {
		alert("You've exceeded your local storage capacity! " +
				"Clear your browser cookies/cache and try again!");
	}
}

function readSaveData() {
	var localDataComposition = JSON.parse(localStorage.getItem(key));
	composition = $.extend(new Composition(), localDataComposition);

	for (track = 0; track < composition.getNumTracks(); track++) {
		for (note = 0; note < composition.getTrack(track).length; note++) {
			
			var noteOnTrack = composition.getTrack(track)[note];
			
			composition.getTrack(track)[note] = $.extend(new Note(), noteOnTrack);
			
		}
	}
}