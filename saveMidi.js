function setUpMIDI(){
	var trackSelector = "#track";
	var sortableDivSelector = " .sortable-system div";
    var selector = trackSelector + 0 + sortableDivSelector;	
	$(selector).each(function(){
	    console.log($(this).attr('data-note'));
	    track0.push($(this).attr('data-note'));
	});
}


function saveMIDI() {
    
	/*
    for(noteIndex = 0; noteIndex < composition.getTrack(0).length; noteIndex++){
	    var currTrack = composition.getTrack(0);
		console.log(composition.getNote(0, noteIndex));
	    track0.push(composition.getNote(0, noteIndex));
	}
	*/
	//["C4", "D4", "E4", "F4", "G4"]
    var noteEvents = [];
    ["C4", "D4", "E4", "F4", "G4"].forEach(function(note) {
        Array.prototype.push.apply(noteEvents, MidiEvent.createNote(note));
    });

// Create a track that contains the events to play the notes above
    var track = new MidiTrack({ events: noteEvents });

// Creates an object that contains the final MIDI track in base64 and some
// useful methods.
    var song  = MidiWriter({ tracks: [track] });

// Alert the base64 representation of the MIDI file
    alert("Song is going to be saved in base64 with string representation " + song.b64);

// Play the song
    //song.play();

// Play/save the song (depending of MIDI plugins in the browser). It opens
// a new window and loads the generated MIDI file with the proper MIME type
    song.save();
			
}