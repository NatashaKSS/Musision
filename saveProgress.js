/*
 *  User save data/ read data to/from localStorage of browser for future sessions
 */
var key = "userComposition";

// Checks if user's browser configuration accepts local storage
function supportsLocalStorage() {
	try {
	  return "localStorage" in window && window["localStorage"] !== null;
	} catch (error) {
	  return false;
	}
}

// Writes user's composition to localStorage with a corresponding key. This key
// can be used to retrieve that user's composition saved in another session.
function writeSaveData() {
	try {
		localStorage.setItem(key, JSON.stringify(composition));
	} catch(error) {
		alert("You've exceeded your local storage capacity! " +
				"Clear your browser cookies/cache and try again!");
	}
}

// Reads user's composition from localStorage with the corresponding key. It gets the 
// JSON-stringified version of the user's saved composition object and converts it to 
// the Composition and Note classes for immediate use.
function readSaveData() {
	var localDataComposition = JSON.parse(localStorage.getItem(key));
	composition = $.extend(new Composition([]), localDataComposition);
	// explicitly associates localDataComposition with Composition class.
	
	var numOfTracks = composition.getNumTracks();
	
	for (track = 0; track < numOfTracks; track++) {
		
		if (numOfTracks > 1) {
			addTrack();
		}
			
		for (note = 0; note < composition.getTrack(track).length; note++) {
			
			composition.getTrack(track)[note] = $.extend(new Note(), composition.getTrack(track)[note]);
			// explicitly associates noteOnTrack with Note class for every note in the composition.
			
			var noteOnTrack = composition.getTrack(track)[note];
			// reference to the new note object
			
			var notePitch = noteOnTrack.getPitch();
			
			var noteHTML = "<div class data-note='" + notes.indexOf(notePitch) + 
						   "' style='opacity: 1; display: inline-block; width: 39.0625px; " +
						   "height: 61px; z-index: 0; border: none; padding-top: 15px; " +
						   "border-radius: 1em; vertical-align: top; text-align: center; " +
						   "font-size: 20px; color: rgb(255, 255, 255); " +
						   "text-shadow: rgb(0, 0, 0) 1px 1px 2px; background: rgb(16, 155, 206); '>" +  
						   notePitch + "</div>";
			// Mimics the style of a note on timeline
			
			$("#track" + track).children().eq(1).append(noteHTML);
			
		}
		
	}
}



