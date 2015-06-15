var context = new AudioContext();
var arr = [];

/*-----------------------------------------------------------*/
/*-------------------Sound Generation------------------------*/
/*-----------------------------------------------------------*/
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

/*-----------------------------------------------------------*/
/*-----------Setting up sound source & nodes-----------------*/
/*-----------------------------------------------------------*/

function playSound(midiNum, time) {
	// Create Oscillator and gainNode
	var oscillator = context.createOscillator();
	var gainNode = context.createGain();

	// Set up connections
	oscillator.connect(gainNode);
	gainNode.connect(context.destination);
	
	var mySound = piano(midiNum);
	mySound.start(time);
	
	// Creates an ADSR envelope over the oscillator and 
	// returns the new oscillator with the ADSR applied to its
	// gainNode
	function piano(midiNum) {
		var envelope = new Envelope;
		var source = sineWave(oscillator, midiToFreq(midiNum));
		
		// Set ADSR values here! Note: Decay not implemented yet.
		envelope.setAttackTime(0.02);
		envelope.setReleaseTime(0.3);
		envelope.setSustainValue(1);
		envelope.setSustainTime(0);
		
		envelope.connect(gainNode.gain);
		
		envelope.trigger(0, 1.5);

		var duration = envelope.attackTime + envelope.releaseTime + envelope.sustainTime;
		envelope.setDuration(duration);
		console.log(duration);
		console.log(midiToFreq(midiNum));
		
		return source;
	}
}
/*added notes to play all pressed notes in sequence*/
function add(noteNum){
	arr.push(noteNum);
}


function playAllSound(){//now it's playing all the notes at the same time >_<
    for (i = 0; i < arr.length; i++){
	    playSound(arr[i], context.currentTime + i * 1.50);
		
	}
}
function clearAllSound(){
    arr = [];
}
/*------------------------------------------------*/
/*--------Document interaction with JQuery--------*/
/*------------------------------------------------*/
$(document).ready(function() {
	$(".col-md-1").on("click", function() {
		playSound(parseInt($(this).attr('data-note')), context.currentTime);
		add(parseInt($(this).attr('data-note'))); 
	});
	
	$("#all").on("click", function() {
		playAllSound();
	});
	
	$("#clear").on("click", function() {
		clearAllSound();
	});
	
	/* Draggable */
	 $(function() {
		 $( "#timeline" ).sortable({
			 revert: true
		 });
		 
		 $( ".col-md-1" ).draggable({
			 connectToSortable: "#timeline",
			 helper: "clone",
			 revert: "invalid"
		 });
		 
		 $("div").disableSelection();
	 });
});









/* Unused code Section 1.1: riffwave.js implementation.
 * 
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
*/

/* Lab of experiments...
 * var count = 0;
	
	$(document).on('click', 'body', function() {
		count++;
		$("#timeline").append("<td class='noteDefault'> Note " + count + "</td>");
	});
 *
 */