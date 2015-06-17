//-----------------------------------------------------------//
//-------------------Sound Generation------------------------//
//-----------------------------------------------------------//
var notes = ["C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0",
             "C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1",
             "C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2",
             "C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",
             "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
             "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
             "C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6","A6","A#6","B6",
             "C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","A#7","B7",
             "C8","C#8","D8","D#8","E8","F8","F#8","G8","G#8","A8","A#8","B8",
             "C9","C#9","D9","D#9","E9","F9","F#9","G9","G#9","A9","A#9","B9",
             "C10","C#10","D10","D#10","E10","F10","F#10","G10"];
// 128 notes, of which, the index of a single note in the array corresponds to
// its own MIDI number

			 
var arr = [];//array to store notes to play back


//play notes consecutively at hard-coded intervals
function playSequence(){
    var count = 0;
	while(count < arr.length){
	    piano.play({ 
	    	wait : count * 0.5,
			pitch : arr[count] 
		});
		count = count + 1;
    }
}
//empty the note array    
function clearAllSound(){
    arr = [];
}
//this one plays all notes together, for example a chord
function playSimul(){
    for(i = 0; i < arr.length; i++){
	    piano.play({pitch: arr[i]});
	}
}

var piano = new Wad({
    source : 'sine', 
    env : {
    	volume: 1.0,
        attack : .01, 
        decay : .005, 
        sustain : .2, 
        hold : .015, 
        release : .3
    }
});

/*------------------------------------------------*/
/*--------Document interaction with JQuery--------*/
/*------------------------------------------------*/
$(document).ready(function() {
	$(".col-md-1").on("click", function() {
		piano.play({ 
			pitch : notes[parseInt($(this).attr('data-note')) - 12] 
		});
	});
	
	$("#all").on("click", function() {
		playSequence();
	});
	
	$("#same").on("click", function() {
		playSimul();
	});
	
	$("#clear").on("click", function() {
		clearAllSound();
	});
	
	/* Draggable */
	var inBox = false;
	
	 $(function() {
		 $( "#timeline" ).sortable({
			 scroll: 'true',
			 revert: false,
			 // Functions for deleting note from timeline
			 // Just drag out of timeline area
			 // Needs more work for manipulating the array itself
			 over: function() { // If item is over timeline
				 inBox = true;
			 },
			 
			 out: function() { // If item is outside timeline
				 inBox = false;
			 },
		
			 beforeStop: function(event, ui) { // Before releasing dragging
				 if (!inBox) {
					 ui.item.remove();
				 }
			 }
		 });
		 
		 $( ".col-md-1" ).draggable({
			 cursor: "move",
			 connectToSortable: "#timeline",
			 helper: "clone",
			 opacity: 0.7,
			 revert: false,
			 stop: function() {
				 arr.push(notes[parseInt($(this).attr('data-note')) - 12]);
		    }
		 });
		 
		 $("div").disableSelection();
	 });
	 
});







/* Unused code Section 1.1: Web Audio ADSR implementation.
var context = new AudioContext();
var arr = [];

// ADSR Envelope Generator
var Envelope = (function applyEnvelope() {
	
	function Envelope() {
		this.attackTime = 0.1;
		this.releaseTime = 0.1;
		this.duration = 0;
	}
	
	Envelope.prototype.setAttackTime = function (attack) {
		this.attackTime = attack;
	};
	
	Envelope.prototype.setReleaseTime = function (release) {
		this.releaseTime = release;
	};
	
	Envelope.prototype.setSustainTime = function (sustain) {
		this.sustainTime = sustain;
	};
	
	Envelope.prototype.setSustainValue = function (sustain) {
		this.sustainValue = sustain;
	};
	
	Envelope.prototype.connect = function (param) {
		this.param = param;
	}

	Envelope.prototype.setDuration = function (dur) {
		this.duration = dur;
	}
	
	Envelope.prototype.trigger = function (startGainValue, endGainValue) {
		var now = context.currentTime;
		this.param.cancelScheduledValues(now);
		this.param.setValueAtTime(startGainValue, now);
		this.param.linearRampToValueAtTime(endGainValue, now + this.attackTime);
		
		this.startGainValue = startGainValue;
		this.endGainValue = endGainValue;
		
		if (this.sustainValue > 0) {
			this.param.setValueAtTime(this.sustainValue, now + this.attackTime);
		}
		
		this.param.linearRampToValueAtTime(startGainValue, now + this.attackTime + this.sustainTime + this.releaseTime);
		
	}
	
	return Envelope;
	
})(context);

//-----------------------------------------------------------//
//-------------------Sound Generation------------------------//
//-----------------------------------------------------------//


//Sets the sinewave frequency of a certain source 
//and returns the new source
function sineWave(source, freq) {
	source.type = 'sine';
	source.frequency.value = freq;
	
	return source;
}

function midiToFreq(midiNum) {
	return 440 * Math.pow(2,((midiNum - 69) / 12));
}

//-----------------------------------------------------------
//-----------Setting up sound source & nodes-----------------
//-----------------------------------------------------------
function playSound(midiNum) {
	playSound(midiNum, 0);
}

function playSound(midiNum) {
	// Create Oscillator and gainNode
	var oscillator = context.createOscillator();
	var gainNode = context.createGain();

	// Set up connections
	oscillator.connect(gainNode);
	gainNode.connect(context.destination);
	
	var mySound = piano(midiNum);
	mySound.start(0);
	
	// Creates an ADSR envelope over the oscillator and 
	// returns the new oscillator with the ADSR applied to its
	// gainNode
	function piano(midiNum) {
		var envelope = new Envelope;
		var source = sineWave(oscillator, midiToFreq(midiNum));
		
		// Set ADSR values here! Note: Decay not implemented yet.
		envelope.setAttackTime(0.02);
		envelope.setReleaseTime(0.3);
		envelope.setSustainValue(1); // There is no sustain for a piano key
		envelope.setSustainTime(0);
		
		envelope.connect(gainNode.gain); // Envelope is applied on gainNode
		
		envelope.trigger(0, 1.5);

		// Set duration of ADSR envelope
		var duration = envelope.attackTime + envelope.releaseTime + envelope.sustainTime;
		envelope.setDuration(duration);
		console.log(midiToFreq(midiNum));
		
		return source;
	}
}

//added notes to play all pressed notes in sequence
function add(noteNum){
	arr.push(noteNum);
}


function playAllSound(){
    for (i = 0; i < arr.length; i++){
	    playSound(arr[i]);
    }
}
    
function clearAllSound(){
    arr = [];
}

//------------------------------------------------/
//--------Document interaction with JQuery--------/
//------------------------------------------------/
$(document).ready(function() {
	$(".col-md-1").on("click", function() {
		playSound(parseInt($(this).attr('data-note')));
	});
	
	$("#all").on("click", function() {
		playAllSound();
	});
	
	$("#clear").on("click", function() {
		clearAllSound();
	});
});


-End of Section 1.1-

-----------------------------------------------------------------------------------
 * Unused code Section 1.2: riffwave.js implementation.
 * 
//Gets the midi number which is stated as an attribute of the "col-md-1" 
// note buttons in index.html and plays the respective note on click.
$('.col-md-1').on('click', function() {
	var midiNumber = parseInt($(this).attr('data-note'));
	console.log(midiNumber + " inside "); 
	// console.log for debugging: 
	// To make sure you are using the correct MIDI number
	playSound(midiNumber);
});


// Pre-cond: midiNumber must be a valid note within the valid frequency range
// Post-cond: Plays a sound corresponding to the MIDI number
// Description: Fills sound data with corresponding MIDI number and plays it
function playSound(midiNumber) {
	var data = [],
		sampleRateHz = 44100,
		
		//Notes sequence
		notes = [midiNumber, midiNumber],
		
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

 Lab of experiments...
 var count = 0;
	
	$(document).on('click', 'body', function() {
		count++;
		$("#timeline").append("<td class='noteDefault'> Note " + count + "</td>");
	});
*/