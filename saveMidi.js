//for saving song as a midi file
//note that using General MIDI limits the maximum number of tracks to be 16

function saveMIDI() {
    //debugging for MIDI
		composition.getAllInstruments().forEach(function(instrument){
	    console.log(instrument);
		});
	
	//end debugging for MIDI
	
    var midiNotes = [];
	var tracks = [];
	var arr = [];
	var midiTrack;
	var currInstrument;
	var changeInstrument;
	var instIndex;

	for(trackNum = 0; trackNum < composition.getNumTracks(); trackNum++){
        currInstrument = composition.getInstrument(trackNum);
		console.log("currInstrument " + currInstrument);//debugging
		instIndex = allInstruments.indexOf(currInstrument);
		console.log("index of Instrument " + instIndex + "with GM " + GMinstruments[instIndex]);//debugging
		
	    changeInstrument = new MidiEvent.setInst(trackNum, GMinstruments[instIndex]);
		//changeInstrument = new MidiEvent.setInst(trackNum, 0x28);
        midiNotes.push(changeInstrument);
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

//ABORTED CODES
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