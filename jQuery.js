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
	    if(arr[count] != "silence"){
		    piano.play({ 
	    	    wait : count * 0.5,
			    pitch : arr[count] 
		    });
		} else {
		    quarterRest.play({
			    wait : count * 0.5
			});
		}
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
	    if(arr[i] != "silence"){
		    piano.play({pitch: arr[i]});
		}
	}
}

//remove a note from the array
function removeNote(noteName){
    for (i = 0; i < arr.length; i++){
	    if(arr[i] == noteName){
		    arr.splice(i, 1);
		}
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
//rest here. Quarter rest is just a name to say that it's one of the rests available
var quarterRest = new Wad({
    source : 'sine', 
    env : {
    	volume: 0.0,
        attack : .00, 
        decay : .000, 
        sustain : 0.0, 
        hold : .00, 
        release : 0.0
    }
});
//Takes in num of divs to generate and cssClass to associate
// with each div and outputs a string of representing those divs
function generateDivs(numOfDivs, cssClass, text) {
	var divString = "";
	
	if (cssClass == "") {
		for (n = 0; n < numOfDivs; n++) {
			divString += "<div>" + text + "</div>";
		}
	} else {
		for (n = 0; n < numOfDivs; n++) {
			divString += "<div " + "class=" + cssClass + ">" + text + "</div>";
		}
	}
	
	return divString;
}

/*------------------------------------------------*/
/*--------Document interaction with JQuery--------*/
/*------------------------------------------------*/
$(document).ready(function() {
	$(".col-md-1").on("click", function() {
		
		if(parseInt($(this).attr('data-note')) != 0){
		    piano.play({ 
			    pitch : notes[parseInt($(this).attr('data-note')) - 12] 
		    });
		}
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
	
	/* Generate dynamic grid */
	var scrollbarWidth = 20; 
	// scrollbarWidth to debug instance where notes would fly to
	// the bottom because scrollbar (usually 17px on all browsers) 
	// takes up its space
	
	var timelineTop = $("#timeline").position().top;
	
	var timelineLeft = $("#timeline").position().left;
	
	var timelineHeight = $("#timeline").height() + 
						 parseInt($("#timeline").css("border-top-width")) + 
						 parseInt($("#timeline").css("border-bottom-width"));
	// Includes timeline borders (actual timeline height)
	
	var timelineWidth = $("#timeline").width() - scrollbarWidth;
	
	//Each division possibly representing 1 tick/beat?? Unsure of dimensions yet!
	var noOfDivisions = 8; // 8 is just a default number

	var noteWidth = timelineWidth/noOfDivisions;
	
	var noteHeight = $("#timeline").height() / 3;
	
	// Generate initial grid
	generateGrid(3, noOfDivisions);
	
	// Ensures timeline dimensions are always updated after resizing webpage
	$(window).on("resize", function () {
		$("#grid-system").empty();
		
		timelineTop = $("#timeline").position().top;
		//console.log("timeline top: " + timelineTop);
		
		timelineLeft = $("#timeline").position().left;
		//console.log("timeline left: " + timelineLeft);
		
		timelineHeight = $("#timeline").height() + 
						 parseInt($("#timeline").css("border-top-width")) + 
						 parseInt($("#timeline").css("border-bottom-width"));
		//console.log("timeline height: " + timelineHeight);
		
		timelineWidth = $("#timeline").width() - scrollbarWidth;
		//console.log("timeline width: " + timelineWidth);
		
		noteWidth = (timelineWidth/noOfDivisions);
		//console.log("note width: " + noteWidth);
		
		noteHeight = $("#timeline").height() / 3;
		//console.log("note height: " + noteHeight);
		
		generateGrid(3, noOfDivisions);
		
		$("#timeline div").css({
			"height": noteHeight,
			"width": noteWidth,
		});
		
		//console.log("--End resize--");
	});
	
	// Generates a grid for timeline
	function generateGrid(numRows, numCols) {
		// Generate columns
		$("#grid-system").append(generateDivs(numCols, "grid-col-holder", ""));
		
		// Specify width of each column
		$(".grid-col-holder").css({
			"width": noteWidth
		});
		
		// Generate rows per column (Note: columns have class "grid-col-holder")
		$(".grid-col-holder").append(generateDivs(numRows, "grid-square", ""));
		
		// Specify entire grid's position and height. Note that width is already
		// computed per division in grid-col-holder.
		$("#grid-system").css({
			"top" : timelineTop + 3 + "px", 
			// top: Plus 3 because must exclude top border of timeline
			"height": timelineHeight - 3  
			// height: Minus 3 because must exclude width of top border of 
			// timeline = 3px, since we shifted it down by 3px in "top" 
		});
		
		$(".grid-square").css({
			"height": noteHeight // height of each grid square
		});
	}
	
	/* Draggable events */
	$(function() {
		var inBox = false;
		
		$("#timeline").sortable({
			scroll: true,
			revert: false,
			snap: false,
			 // Functions for deleting note from timeline
			 // Just drag out of timeline area
			 // Needs more work for manipulating the array itself
			over: function(event, ui) { // If item is over timeline
				inBox = true;
			},
			 
			out: function(event, ui) { // If item is outside timeline
				inBox = false;
			},
		
			beforeStop: function(event, ui) { // Before releasing dragging
				if (!inBox) {
					ui.item.remove();
					//change notes in array. Bug: still needs the "queue number"
					if(parseInt(ui.item.attr('data-note')) > 12){//this now still has a bug: it removes everything that has the same name as the note dragged out
					    removeNote(notes[parseInt(ui.item.attr('data-note')) - 12]);
					} else {
					    removeNote("silence");//the rest inserted here
					}
				}
			},
			 
			receive: function(event, ui) { // Only when timeline receives the note
				if(parseInt(ui.item.attr('data-note')) != 0){
				    arr.push(notes[parseInt(ui.item.attr('data-note')) - 12]);
				} else {
				    arr.push("silence");
				}
				$("#timeline div").css({
					"height": noteHeight,
					"width": noteWidth,
					"box-shadow": "none",
					"margin-top": "0px",
					"margin-bottom": "0px"
				});
			}
		});
			 
		$(".col-md-1").draggable({
			cursor: "move",
			connectToSortable: "#timeline",
			helper: "clone",
			opacity: 0.7,
			revert: false
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