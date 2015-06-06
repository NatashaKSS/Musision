//The notes sequence array is borrowed from
//https://github.com/ValdemarOrn/valdemarorn.github.com/tree/master/Files/JSAudio 
//Thanks! :)

/*------------------------------------*/
/*--------Document interaction--------*/
/*------------------------------------*/
$(document).ready(function() {
	// Add a div inside the timeline
	var count = 0;
	
	$(document).on('click', 'body', function() {
		count++;
		$("#timeline").append("<td class='noteDefault'> Note " + count + "</td>");
	});
	
	// Gets the midi number which is stated as an attribute of the "col-md-1" 
	// note buttons in index.html and plays the respective note on click.
	$('.col-md-1').on('click', function() {
		var midiNumber = parseInt($(this).attr('data-note'));
		console.log(midiNumber + " inside "); 
		// console.log for debugging: 
		// To make sure you are using the correct MIDI number
		playSound(midiNumber);
	});
	
});

/*----------------------------------*/
/*--------Audio manipulation--------*/
/*----------------------------------*/
// Pre-cond: midiNumber must be a valid note within the valid frequency range
// Post-cond: Plays a sound corresponding to the MIDI number
// Description: Fills sound data with corresponding MIDI number and plays it
function playSound(midiNumber) {
	var data = [],
		sampleRateHz = 44100,
		
		//Notes sequence
		notes = [midiNumber],
		
		//Base Frequency based on the notes
		baseFreq = function(index) {
			var r = 2 * Math.PI * 440.0 * Math.pow(2,(notes[index]-69)/12.0) / sampleRateHz;
			return r;
		};
	
	//Fill up the sound data!!
	for(var j = 0; j < 2*sampleRateHz; j++) {
		var l = 2*sampleRateHz / notes.length;
		data[j] = 64 + 32 * Math.round(Math.sin(baseFreq(Math.round(j/l)) * j));
	}
	
	//Riffwave stuff
	var wave = new RIFFWAVE();
	wave.header.sampleRate = sampleRateHz;
	wave.header.numChannels = 1;
	wave.Make(data);
	var audio = new Audio();
	audio.src=wave.dataURI;
	
	// Play sound immediately after filling audio object
	audio.play();
}