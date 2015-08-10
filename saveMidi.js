/*
function setUpMIDI(){
    console.log("in setUpMIDI");//<--- why is this not visted?
	/*
	var trackSelector = "#track";
	var sortableDivSelector = " .sortable-system div";
    var selector = trackSelector + 0 + sortableDivSelector;	
	$(selector).each(function(){
	    console.log($(this).attr('data-note'));
	    track0.push($(this).attr('data-note'));
	});
	
	composition.getTrack(0).map(function(note){
	    console.log(note.getPitch());
	    track0.push(note.getPitch());
	});
}
*/
function saveMIDI() {
    var midiNotes = [];
	var tracks = [];
	var arr = [];
	var midiTrack;
	
	for(trackNum = 0; trackNum < composition.getNumTracks(); trackNum++){
	

    composition.getTrack(trackNum).forEach(function(note) {
	    console.log("in saveMIDI");
        arr.push.apply(midiNotes, MidiEvent.createNote(note.getPitch(), trackNum));
    });
// Create a track that contains the events to play the notes above
    midiTrack = new MidiTrack({ events: midiNotes });

	tracks.push(midiTrack);
	
	
    arr = [];
	midiNotes = [];
	midiTrack = [];
	}
// Creates an object that contains the final MIDI track in base64 and some
// useful methods.
    var song  = MidiWriter({ tracks: tracks });

// Alert the base64 representation of the MIDI file
 //   alert("Song is going to be saved in base64 with string representation " + song.b64);

    song.save();
			
}