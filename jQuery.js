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

/*
 * Variables Declaration
 */
var beatDuration = 0.3;//Default duration of 1 beat
var enableLooping = false;
var loopId = 0;
var enablePlaying = true;
var playingMusic;
var pause = false;
/*
 * User Tracks Constructor, named a composition
 * A composition contains many track, e.g. piano track, guitar track...
 * */
function Composition(track) {
	// this.tracks represents an array of tracks.
	// Because one user may have many tracks.
	// A track contains a song of some number of notes.
	this.tracks = [track]; 
}

// Gets the array of tracks a user has made
Composition.prototype.getAllTracks = function() {
	return this.tracks;
}

// Get one particular track a user has made
Composition.prototype.getTrack = function(trackNum) {
	return this.tracks[trackNum];
}

// Adds a track to a user's composition
Composition.prototype.addTrack = function(track) {
	this.tracks.push(track);
}

// Adds a note to a specified track in a user's composition
Composition.prototype.addNote = function(trackNum, note) {
	this.tracks[trackNum].push(note);
}

// Empty a specified track 
Composition.prototype.emptyTrack = function(trackNum) {
	this.tracks[trackNum] = [];
}


//Any user's new composition contains, by default, one track.
var composition = new Composition([]);


/*
 * Note Object Constructor
 * */
function Note(pitch, duration) {
	this.pitch = pitch; // Should be represented as a string, e.g. "C4"
	this.duration = duration;
}

// Returns the pitch of the note
Note.prototype.getPitch = function() {
	return this.pitch;
}

// Returns the duration of a note
Note.prototype.getDur = function() {
	return this.duration;
}

Note.prototype.setPitch = function(pitch) {
	this.Pitch = pitch;
}

Note.prototype.setDuration = function(dur) {
	this.duration = dur;
}

////To pause and play again 
function Timer(func, delay) {
    this.func = func;
    this.timerId = setTimeout(func, delay); 
    this.start = new Date(); 
	this.remaining = delay;
}

 Timer.prototype.pause = function() {
    clearTimeout(this.timerId);
    this.remaining -= new Date() - this.start;
	console.log("time left " + this.remaining);
}

 Timer.prototype.resume = function() {
    clearTimeout(this.timerId);
    this.start = new Date();
    this.timerId = setTimeout(this.func, this.remaining);
}



/*------------------------------------------------*/
/*-----------------Main Functions-----------------*/
/*------------------------------------------------*/
function changeBPM(){
	beatDuration = 0.3; // Flushes the previous values of beatDuration
    var ans = document.getElementById("bpm-input").value;
	
    // Input validation
    try {
    	if (isNaN(ans)) {
    		throw "not a number.";
    	} else if (ans == "") {
    		throw "empty.";
    	} else if (ans < 0) {
    		throw "negative. Please input a positive number."
    	} else {
    		beatDuration = beatDuration / (parseInt(ans)/120);
    	}
    } catch(error) {
    	alert("Input is " + error);
    }
}



//play notes consecutively at hard-coded intervals
function playSequence(trackNumber) {
    var count = 0;
    var noteDuration = (beatDuration) * 1000;
    var wholeDuration = (beatDuration) * 1000 * (composition.getTrack(0).length);
    
    // Note to self that noteDuration & wholeDuration will need to change
    // because for each animation of a note, it has a different timing
    // now that each note has its own timing. --> Once diff notes support diff lengths
    playAnimation(noteDuration, wholeDuration);
    
    composition.getTrack(trackNumber).map(function(){
	
	
	var thisPitch = composition.getTrack(trackNumber)[count].getPitch();
	
	if(enablePlaying){
	//console.log("still playing, pause " + pause);
	//console.log("enablePlaying " + enablePlaying);
		if(pause == false){//if playing as normal and haven't paused yet, enablePlaying = true; pause = false;
			playingMusic = new Timer(function(){
				
		        if(thisPitch != "silence"){
			         piano.play({
			         pitch : thisPitch,
				     label : "playing"
			    });
		        } else {
		          quarterRest.play({label : "playing"});
		
			    }
		        
		    },  noteDuration * count);
			    
		} else {//when pause is on , enablePlaying = true and pause = true;
		   // console.log("in Pause " + pause);
		   //	console.log("enablePlaying " + enablePlaying);
		    playingMusic.pause();
		}
	
	} else if(pause == false) {//if want to resume after pausing, enablePlaying = false and pause = false
	    //console.log("Resuming, pause " + pause);
		//console.log("enablePlaying " + enablePlaying);
		playingMusic.resume();
		
		enablePlaying = true;
		//pause = false;
	}
	    count++;
	});
}
  /*  
	while(count < composition.getTrack(0).length){
	    if(composition.getTrack(0)[count].getPitch() != "silence"){
		    piano.play({ 
	    	    wait : count * beatDuration,
	    	    // noteDuration should be arr[count].getDur(), but need to 
			    // change other things first.
			    pitch : composition.getTrack(0)[count].getPitch(),
				label : "playing" 
		    });
		    
		} else {
		    quarterRest.play({
			    wait : count * noteDuration, 
			    // noteDuration should be arr[count].getDur(), but need to 
			    // change other things first.
				label : "playing" 
			});
		}
		count = count + 1;
    }
	*/


//empty the note array    
function clearAllSound(){
    piano.stop("playing");
    composition.emptyTrack(0);
    
	if(enableLooping){
	    document.getElementById("startLoop").value = "Start Looping";
        document.getElementById("startLoop").innerHTML = "Start Looping";
	    clearInterval(loopId);
	}
	
}


function loopAll(){
    if(document.getElementById("startLoop").value == "Start Looping"){//currently stop, now we want to start
	    enablePlaying = true;
		enableLooping = true;
	    document.getElementById("startLoop").value = "Stop Looping";//change to stop
		document.getElementById("startLoop").innerHTML = "Stop Looping";//change to stop
	    playSequence(0);
	    loopId = setInterval("playSequence()", beatDuration * composition.getTrack(0).length * 1000);    
	} else {//if we want to stop
	    enableLooping = false;
	    document.getElementById("startLoop").value = "Start Looping";
		document.getElementById("startLoop").innerHTML = "Start Looping";
	    clearInterval(loopId);
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

/* Utility Functions */
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

function playAnimation(duration, wholeDuration) {///////This needs debugging and cleaning up
	jQuery(function($) {
		// This offset timing makes the animation smoother
		var offset = -200;
		
		// Change each div's colour as note plays
		// Applies setTimeout function to every div in the timeline
		$(".sortable-system div").map(function() {
			var that = $(this);			    
			playId = setTimeout(function () {
			   if(enablePlaying){
	            //  console.log("in if, enable " + enablePlaying);
		          that.css({ 
		            "background": "#80ffff" //change color to light blue
			      });
		        } else {//if pause/stop/clearAll is pressed. 
			       clearTimeout(playId);
	             //  console.log("in else, enable " + enablePlaying);
				  setTimeout(function () {
	                $(".sortable-system div").css({ "background-color": "#109bce" });
                    }, 100);
			    }
			}, duration + offset);
				offset += duration;
		});
		
        setTimeout(function () {
            $(".sortable-system div").css({ "background-color": "#109bce" });
        }, wholeDuration);
		

	});    
}

/*------------------------------------------------*/
/*--------Document interaction with JQuery--------*/
/*------------------------------------------------*/
$(document).ready(function() {
	function initialize() {
		
		$(".col-md-1").on("click", function() {
			
			var noteName = $(this).attr('data-note');
			
			if(noteName != "silence"){
			    piano.play({ 
				    pitch : notes[parseInt(noteName - 12)] 
			    });
			} else {
				// Do nothing to mimic silence...ooh
			}
		});
		
		$("#all").on("click", function() {
		    enablePlaying = true;
			playSequence(0);
		});
		
		$(".play-button").unbind().on("click", function() {
			var trackNum = parseInt($(this).attr('id').substring(10));
			
			playSequence(trackNum);
		});
	    
		//pause is not working properly
		$("#pause").on("click", function(){
		    if(document.getElementById("pause").value == "Pause"){//if currently playing and pause is clicked, enablePlaying = true, pause = true
		    document.getElementById("pause").value = "Resume";
			document.getElementById("pause").innerHTML = "Resume";
			enablePlaying = true;
			pause = true;
			//console.log("PAUSE NOW!!!!");
			//playingMusic.pause();
			} else {//want to resume
			document.getElementById("pause").value = "Pause";
			document.getElementById("pause").innerHTML = "Pause";
			enablePlaying = false;
			pause = false;
			//console.log("CONTINUE!!!!");
		    //playingMusic.resume();	
			}
		});
		
		//end pause
		$("#stop").on("click", function() {
		    enablePlaying = false;
			enableLooping = false;
		    piano.stop("playing");
		    
			    document.getElementById("startLoop").value = "Start Looping";
			    document.getElementById("startLoop").innerHTML = "Start Looping";
		        clearInterval(loopId);
			
		});
		
		$("#clear").on("click", function() {
		    $(".sortable-system div").remove(); //remove notes from the timeline
		    enablePlaying = false;
			enableLooping = false;
			clearAllSound();
			
			    document.getElementById("startLoop").value = "Start Looping";
			    document.getElementById("startLoop").innerHTML = "Start Looping";
		        clearInterval(loopId);
			
		});
		
		$("#startLoop").on("click", function() {
		    if(composition.getTrack(0).length != 0)loopAll();
	    });	
		
		$(".sortable-system").mousewheel(function(event, delta) {
			this.scrollLeft -= (delta * 15);
			event.preventDefault(); // Prevent scrolling down
		});
	
	}
	
	/* INITIALIZE EVERYTHINGGGG */
	//introJs("body").start();
	initialize();
	
	
	var trackNum = 1; // We start from 1 now since 0 is already in composition by default
	
	$("#addTrack").on("click", function() {
		var newTrack = $(".track").first().clone();
		
		// Setting the id of tracks added and appending them to correct place
		// Every new track added will have a unique ID which increments by 1 as
		// more tracks are added. NOTE THAT WE START COUNTING FROM 0.
		
		// For play button
		newTrack.children().eq(0).children().attr('id', "play-track" + trackNum);
		
		// For track number
		newTrack.children().eq(1).attr('id', "track" + trackNum);
		
		// Appending to timeline-system
		newTrack.appendTo("#timeline-system");
		$("#track" + trackNum + " .sortable-system div").remove();
		
		// Sets up sortable and horizontal scrolling for the new tracks
		setSortable();
		initialize();
		
		// Correspondingly add a new track to our composition
		composition.addTrack([]);
		
		trackNum++;
		
	});
	
	
/*------------------------------------------------*/
/*------------- Generate dynamic grid-------------*/
/*------------------------------------------------*/
	var scrollbarWidth = 20; 
	// scrollbarWidth to debug instance where notes would fly to
	// the bottom because scrollbar (usually 17px on all browsers) 
	// takes up its space -- trust me LOL

	var numOfDivisions = 16;
	var timelineHeight = $(".timeline").height() + 
						 parseInt($(".timeline").css("border-top-width")) + 
						 parseInt($(".timeline").css("border-bottom-width"));
	var timelineWidth = $(".timeline").width();

	var grid = new GridSystem(composition.getTrack(0).length,
							  scrollbarWidth,
							  numOfDivisions,
							  $(".timeline").position().top,
							  $(".timeline").position().left,
							  timelineHeight,
							  timelineWidth,
							  timelineWidth / numOfDivisions,
							  timelineHeight - 17); //17 is scrollbarWidth(20) - timeline border widths(3)
	
	// Generate initial grid
	grid.generateGrid(1, numOfDivisions);
	
	// Ensures timeline dimensions are always updated after resizing webpage
	$(window).on("resize", function () {
		grid.resizeGrid();
	});

/*------------------------------------------------*/
/*------------ Draggables & Sortables-------------*/
/*------------------------------------------------*/
function setSortable() {	
	$(function() {
		var inBox = false; // Flag that facilitates removal of note
		var inBeforeStop = false; // Flag that facilitates colour of note when removed
		var trackNumInSortable = 0; // Default trackNum
		
		$(".sortable-system").sortable({
			scroll: false,
			revert: false,
			snap: false,
			connectWith: $(".sortable-system"),
			
			placeholder: {
				element: function() {
		            return $("<div class='ui-sortable-placeholder'></div>")[0];
		        },
		        update: function() {
		        	$(".ui-sortable-placeholder").css({
			    		"height": grid.noteHeight,
			    		"width": grid.noteWidth
			    	});
		        	
		            return;
		        }
			},
			
			start: function(event, ui) {
				var startPosition = ui.item.index(); //original index
				ui.item.data('startPos', startPosition); //create data called startPos and set it to startPosition
				
				trackNumInSortable = parseInt(ui.item.parent().parent().attr("id").substring(5));
				//Every ID of a track is in the format "track0", "track1", "track23", so substring works here
				
			},
			
			// Whenever user has stopped sorting and the DOM element (HTML) has changed
			update: function(event, ui) {
				var startPosition = ui.item.data('startPos');
				var endPosition = ui.item.index();//new position
				var grabbedNote = "";
				
				// Because parseInt returns undefined for letters, we must do a check here
				if (ui.item.attr('data-note') != "silence") { 
					grabbedNote = new Note(notes[parseInt(ui.item.attr('data-note')) - 12], 
										   beatDuration);
				} else {
					grabbedNote = new Note(ui.item.attr('data-note'), 
							   			   beatDuration); //refers to silence
				}
				
				// When position of a note changes on the timeline, follow up 
				// with appropriate swap in position of notes in the array as well
				if (startPosition < endPosition) {
					// When swapping from left to right
					composition.getTrack(trackNumInSortable).splice(endPosition + 1, 0, grabbedNote);
					composition.getTrack(trackNumInSortable).splice(startPosition, 1);
					
				} else if (startPosition > endPosition) {
					// When swapping from right  to left
					composition.getTrack(trackNumInSortable).splice(endPosition, 0, grabbedNote);
					composition.getTrack(trackNumInSortable).splice(startPosition + 1, 1);
				}
				
			},
			
			// If item is hovering over timeline
			over: function(event, ui) {
				inBox = true;
				inBeforeStop = false;
				
				ui.item.css({
					"background-color":"#109bce", // Light blue
					"border":"none"
				});
			},
			 
			// If item is dragged outside timeline OR if item is dropped
			// onto timeline
			out: function(event, ui) {
				inBox = false;
				
				if (!inBeforeStop) {
					ui.item.css({
						"background-color":"red",
						"border":"2px solid yellow"
					});
				}
			},
			
			// Just before releasing dragging and item is outside timeline
			beforeStop: function(event, ui) {
				//console.log("beforeStop");
				inBeforeStop = true;
				
				if (!inBox) {
					var startPosition = ui.item.data('startPos');
					composition.getTrack(trackNumInSortable).splice(startPosition, 1);
					
					ui.item.remove();
				}				
			},
			
			// When timeline receives the user-dragged note
			receive: function(event, ui) {
				if(ui.item.attr('data-note') != "silence"){
		      		var insertedNote = new Note(notes[parseInt(ui.item.attr('data-note')) - 12], 
		      									beatDuration);
					composition.addNote(trackNumInSortable, insertedNote);
					
				} else {
					var insertedSilence = new Note(ui.item.attr('data-note'), 
												   beatDuration);
					// Pitch for silence is just "silence"
					// ui.item.attr('data-note')) is just the string "silence"
					composition.addNote(trackNumInSortable, insertedSilence);
					
				}
				
				// Change the look of a note on the timeline
				$(".sortable-system div").not(".ui-sortable-placeholder").removeClass().css({
					"height": grid.noteHeight,
					"width": grid.noteWidth,
					"padding-top": "15px",
					"background": "#109bce", //default light blue-ish #109bce
			    	"border-radius": "1em",
					"display": "inline-block",
					"vertical-align": "top",
					"text-align": "center",
					"font-size": "20px",
					"color": "#FFFFFF",
					"text-shadow": "1px 1px 2px #000000"
				});
				
			}
		}).disableSelection();
			 
		$(".col-md-1").draggable({
			cursor: "pointer",
			connectToSortable: ".sortable-system",
			helper: "clone",
			opacity: 0.7,
			revert: false,
			start: function(event, ui) {
				ui.helper.hide();
			}
		});
	});
	}
	
	setSortable();
	
});






/*
------------------------------------
----------CODE ON HOLD--------------
------------------------------------
(BEFORE DRAGGABLES & SORTABLES HEADING)
//Aborted functions
function findIndex(element, count){
    for(child = 1; child <= count; child++){//go down each column
	    var col = ($("element:nth-child(child)").position().left - $(".timeline").position().left)/noteWidth;
		var row = ($("element:nth-child(child)").position().top - $(".timeline").position().top)/noteHeight;
		var index = row * numOfDivisions + col;
		
		    if(parseInt($("element:nth-child(child)").attr('data-note')) > 0){
		        arr[index] = notes[parseInt($("element:nth-child(child)").attr('data-note')) - 12];
		    } else {
			    arr[index] = 'silence';
		    }
	}
}

function updateArray(){
    for(child = 1; child <= numOfDivisions; child++){
	    console.log($("#grid-system : nth-child(child)"));//hmm debugging here but nothing came out
	    findIndex($("#grid-system : nth-child(child)"), 3);
	}
}


(IN BEFORESTOP IN SORTABLE FUNCTION)
//now index is no longer preserved =(  
// arr.splice(index, 1);			
	    
		/*aborted parts
		if(parseInt(ui.item.attr('data-note')) > 12){//this now still has a bug: it removes everything that has the same name as the note dragged out
		    removeNote(notes[parseInt(ui.item.attr('data-note')) - 12]);
		    numOfNotes--;
		} else {
		    removeNote("silence");//the rest inserted here
		}
		//end of aborted parts

(IN RECEIVE IN SORTABLE FUNCTION)
var col = (ui.item.position().left - $(".timeline").position().left)/grid.noteWidth;
var row = (ui.item.position().top - $(".timeline").position().top)/grid.noteHeight;
var index = row * numOfDivisions + col;

if (parseInt(ui.item.attr('data-note')) > 0) {
    arr.splice(index, 0, notes[parseInt(ui.item.attr('data-note')) - 12]);
} else {
    arr.splice(index, 0, 'silence');
}
	
numOfNotes++;

------------------------------------
------END CODE ON HOLD--------------
------------------------------------

Unused code Section 1.0: Supposedly debug code which made things worse

// Bug fixer for instance when notes flicker on timeline when sorting 
sort: function (event, ui) {
    var that = $(this);
    var w = ui.helper.outerWidth(); // Width of a note on timeline
    var	h = ui.helper.outerHeight(); // Height of a note on timeline
    
    that.children().each(function () {
        if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder')) 
            return true;
        
        // If user mouse overlap is more than half of the dragged item
        var distX = Math.abs(ui.position.left - $(this).position().left),
            before = ui.position.left > $(this).position().left;
            
        if ((w - distX) > (w / 2) && (distX < w)) {
            if (before) // dragged item is to the left of thing to sort with
                $('.ui-sortable-placeholder', that).insertBefore($(this));
            else // dragged item is to the right of thing to sort with
                $('.ui-sortable-placeholder', that).insertAfter($(this));
            return false;
        }
        
     // If user mouse overlap is more than half of the dragged item
        var distY = Math.abs(ui.position.left - $(this).position().left),
            before = ui.position.top > $(this).position().top;
            
        if ((h - distY) > (h / 2) && (distY < h)) {
            if (before) // dragged item is to the top of thing to sort with
                $('.ui-sortable-placeholder', that).insertBefore($(this));
            else // dragged item is to the btm of thing to sort with
                $('.ui-sortable-placeholder', that).insertAfter($(this));
            return false;
        }
    });
		    },
		    
Unused code Section 1.1: Web Audio ADSR implementation.
var numOfNotes = arr.length;

// Procedurally generates more rows if the user has almost filled up timeline with
// notes. 
// ((numOfNotes == (3 * numOfDivisions - 1)) checks if the user has only 1 note left to
// fully fill the timeline to generate 1 row.
// ((numOfNotes > (3 * numOfDivisions)) && (numOfNotes % numOfDivisions == 0)) checks
// if the user, after filling up the first (3 * numOfDivisions - 1) slots --> In this case it is 
// the first 3 rows, and everytime he almost fills up the next row, generate another following row.
if ((numOfNotes == (3 * numOfDivisions - 1)) ||
	((numOfNotes > (3 * numOfDivisions)) && (numOfNotes % numOfDivisions == 0))) {
	// Append a row of grid-squares
	$(".grid-col-holder").append(generateDivs(1, "grid-square", ""));
	
	// Ensure grid-squares are of correct height
	$(".grid-square").css({
		"height": grid.noteHeight // height of each grid square
	});
}
				 
Unused code Section 1.2: Web Audio ADSR implementation.
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

*/