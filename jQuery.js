//-----------------------------------------------------------//
//-------------------Sound Generation------------------------//
//-----------------------------------------------------------//
/*
 * "C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0",
   "C0","C#0","D0","D#0","E0","F0","F#0","G0","G#0","A0","A#0","B0",
   "C1","C#1","D1","D#1","E1","F1","F#1","G1","G#1","A1","A#1","B1",*/

/*
 * "C8","C#8","D8","D#8","E8","F8","F#8","G8","G#8","A8","A#8","B8",
   "C9","C#9","D9","D#9","E9","F9","F#9","G9","G#9","A9","A#9","B9",
   "C10","C#10","D10","D#10","E10","F10","F#10","G10"*/

var notes = ["C2","C#2","D2","D#2","E2","F2","F#2","G2","G#2","A2","A#2","B2",  //c2 is 36
             "C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",  //c3 is 48
             "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",  //c4 is 60
             "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
             "C6","C#6","D6","D#6","E6","F6","F#6","G6","G#6","A6","A#6","B6",
             "C7","C#7","D7","D#7","E7","F7","F#7","G7","G#7","A7","A#7","B7"];
// 128 notes, of which, the index of a single note in the array (from 12) corresponds to
// its own MIDI number

/*
 * Variables Declaration
 */
var enableLooping = false;
var loopId = 0;
var animationLoopId = 0;
var startPlayingFrom = 0;
var playUntil = -1;
var pi = Math.PI;
var songOfPi = [];  //to prepare for the song using PI's numbers
var goldenRatio = (1 + Math.sqrt(5))/2;

// Important! The Wad object in instrumentObjects array corresponds to 
// the position of the corresponding string representation of that instrument obj
// Please do not jumble sequence and always make sure it is parallel!
var allInstruments = ["Piano", "Guitar", "Violin", "Flute", "Bell"];
var instrumentObjects = [piano, synthGuitar, string, flute, bell];
var GMinstruments = [0x00, 0x1D, 0x28, 0x4B, 0x0A];


/*
 * User Tracks Constructor, named a composition
 * 
 * */
function Composition(track) {
	// this.tracks represents an array of tracks.
	// Because one user may have many tracks.
	// A track contains a song of some number of notes.
	this.tracks = [track];
	
	// Default length of 1 note
	this.beatDuration = 0.5;
	
	// User's BPM input
	this.BPM = parseInt($("#bpm-input").attr("placeholder"));
	
	// Default note sustain duration 0.015secs, which is Wad's
	// hold attribute for piano
	this.noteLength = 0.015;
	
	// List of booleans for indicating if this track has enabled playing.
	this.enablePlaying = [true];
	
	// Tracks number of tracks on timeline
	this.numOfTracks = 1;
	
	// Instruments corresponding to each track
	this.instruments = [];
	
	// Default instrument for first track is "Piano"
	this.instruments[0] = "Piano";
	
	// User's colour gradient for notes palette
	this.octaveColour = "blue"; 
}

// Gets the array of tracks a user has made
Composition.prototype.getAllTracks = function() {
	return this.tracks;
}

// Get one particular track a user has made
Composition.prototype.getTrack = function(trackNum) {
	return this.tracks[trackNum];
}

Composition.prototype.getBeatDuration = function() {
	return this.beatDuration;
}

Composition.prototype.setBeatDuration = function(dur) {
	this.beatDuration = dur;
}

Composition.prototype.getBPM = function() {
	return this.BPM;
}

Composition.prototype.setBPM = function(bpm) {
	this.BPM = bpm;
}

Composition.prototype.getAllInstruments = function() {
	return this.instruments;
}

Composition.prototype.getInstrument = function(trackNum) {
	return this.instruments[trackNum];
}

Composition.prototype.setInstrument = function(trackNum, instrument) {
	 this.instruments[trackNum] = instrument;
}
// Adds a track to a user's composition
Composition.prototype.addTrack = function(track) {
	this.tracks.push(track);
	this.enablePlaying.push(true);
	this.instruments.push("Piano");
	this.numOfTracks++;
}

// Adds a note to a specified track in a user's composition
Composition.prototype.addNote = function(trackNum, note) {
	this.tracks[trackNum].push(note);
}

Composition.prototype.getNote = function(trackNum, noteIndex) {
	return this.tracks[trackNum][noteIndex];
}

// Removes a track from composition 
Composition.prototype.deleteTrack = function(trackIndexToDelete) {
	this.tracks.splice(trackIndexToDelete, 1);
	this.instruments.splice(trackIndexToDelete, 1);
	this.numOfTracks--;
}

// Empty a specified track 
Composition.prototype.emptyTrack = function(trackNum) {
	this.tracks[trackNum] = [];
}

// Empty all tracks 
Composition.prototype.emptyAllTracks = function(trackNum) {
	var numOfTracks = this.tracks.length;
	
	for (i = 0; i < numOfTracks; i++) {
		this.tracks[i] = [];
	}

}

// Gets the boolean value for whether a track has 'playing' enabled or not
Composition.prototype.isEnablePlaying = function(trackNum) {
	return this.enablePlaying[trackNum];
}

// Enable/Disable playing, must accept only boolean values true/false.
Composition.prototype.setEnablePlaying = function(trackNum, bool) {
	this.enablePlaying[trackNum] = bool;
}

Composition.prototype.getNumTracks = function() {
	return this.numOfTracks;
}

//Gets the string representation of colour, 
//e.g. "blue", "green"...
Composition.prototype.getOctaveColourString = function() {
	return this.octaveColour;
}

// Gets the hexadecimal representation of the String colour, 
// e.g. "blue" --> "#109bce" (gets this)
Composition.prototype.getOctaveColour = function() {
	var coloursList = ["blue", "green", "orange", "red", "white"];
	var buttonColour = ["#109bce", "#248F24", "#E65C00", "#E60000", "#FFFFFF"];
	
	return buttonColour[coloursList.indexOf(this.octaveColour)];
}

// Sets new string representation of colour of notes palette octave
// colour must be a string, like "blue", "red"...
Composition.prototype.setOctaveColour = function(colour) {
	this.octaveColour = colour;
}

/*
 * Note Object Constructor
 */

function Note(pitch) {
	this.pitch = pitch; // Should be represented as a string, e.g. "C4"
	
	// Whole note: 2000ms, Half note: 1000ms... for 120 BPM so far
	// adapted from https://www.msu.edu/course/asc/232/song_project/dectalk_pages/note_to_%20ms.html
	// and http://rsgames.org/bpmtool.php
	this.duration = 0.5; // Our default 120BPM quarter note
}

// Returns the pitch of the note
Note.prototype.getPitch = function() {
	return this.pitch;
}

// Returns the duration of a note
Note.prototype.getDuration = function() {
	return this.duration;
}

Note.prototype.setPitch = function(pitch) {
	this.pitch = pitch;
}

Note.prototype.setDuration = function(dur) {
	this.duration = dur;
}


/*
 * Track Animation Constructor
 * */
function Animation() {
	this.currentAnimationOngoing = [];
	this.revertAnimationOngoing = [];
	this.elementsAnimated = [];
}

Animation.prototype.playAnimation = function(duration, wholeDuration, startIndex, endIndex, trackNum) {
	jQuery(function($) {
	
		// This offset timing makes the animation smoother
		var offset = -300;
		var trackID = "#track" + trackNum + " "; // Space and # here to match CSS selector syntax
		
		if (startIndex <= 0) { // User chose first note 
			this.elementsAnimated = $(trackID + ".sortable-system div");
		} else {
			//this.elementsAnimated = $(trackID + ".sortable-system div:gt(" + (startIndex - 1) + ")");
			this.elementsAnimated = $(trackID + ".sortable-system div").slice(startIndex, endIndex + 1);
			console.log("Debugging animation " + "start at " + startIndex + " end at " + endIndex );
		}
		
		// Change each div's colour as note plays
		// Applies setTimeout function to every div in the timeline
		this.elementsAnimated.map(function() {
			var that = $(this);
			
			this.currentAnimationOngoing = setTimeout(function() {
				that.css({ 
				   "background": "#80ffff" //change color to light blue
				});
			}, duration + offset);
			
			offset += duration;
		});
		
		this.revertAnimationOngoing = setTimeout(function () {
	        updateTimelineNotes();
	    }, wholeDuration);
		
	});
	
}

//Stops all animation regardless of whether setTimeout or setInterval has been set
Animation.prototype.stopAnimation = function() {
	
	$(".sortable-system div").map(function() {
		clearTimeout(this.currentAnimationOngoing);
		clearTimeout(this.revertAnimationOngoing);
	});
	
	$(".sortable-system div").css({
		"border": "none"
	});
	
	updateTimelineNotes();
}

/*------------------------------------------------*/
/*------------ Initialize Objects-----------------*/
/*------------------------------------------------*/

var composition = new Composition([[]]);
var animation = new Animation();



/*--------------------------------------------------------*/
/*--------------------Main Functions----------------------*/
/*--------------------------------------------------------*/
function changeBPM(){
	var beatDuration = 0.5;
    var ans = document.getElementById("bpm-input").value;
	
    // Input validation
    try {
    	$("#bpm-input").val("");
    	
    	if (isNaN(ans)) {
    		throw "not a number.";
    	} else if (ans == "") {
    		throw "empty.";
    	} else if (ans < 0) {
    		throw "negative. Please input a positive number."
    	} else if (ans == 0) {
    		throw "a little too small. Please input a number from 1 to 300.";
    	} else if (ans > 300) {
    		throw "...Whoa! Too huge! Please input a number from 1 to 300."
    	} else {
    		beatDuration = beatDuration / (parseInt(ans)/120);
    		composition.setBeatDuration(beatDuration);
    		composition.setBPM(parseInt(ans));
    	}
    } catch(error) {
    	alert("Input is " + error);
    }
    
    setBPMinput();
}

function setBPMinput() {
	$("#bpm-input").attr("placeholder", composition.getBPM() + "");
}

//play notes consecutively at hard-coded intervals
function playSequence(trackNumber, startIndex, endIndex) {
    //endIndex = Math.min(endIndex, findMaxLength());
    var beatDuration = composition.getBeatDuration();
	var noteDuration = (beatDuration) * 1000;
    var wholeDuration = (beatDuration) * 1000 * (Math.max(endIndex, playUntil) - startIndex + 1);

    //console.log("play Until " + playUntil);
    if(composition.isEnablePlaying(trackNumber)){
    	animation.playAnimation(noteDuration, wholeDuration, startIndex, endIndex, trackNumber);
		console.log("start " + startIndex);
		console.log("end " + endIndex);
        console.log("length " + (endIndex - startIndex + 1));
		
		setTimeout(function(){
		    animation.stopAnimation();
			}, wholeDuration);
		
        for(indx = startIndex; indx <= endIndex; indx++) {
		    if (composition.getTrack(trackNumber)[indx] != undefined) {	
				var currentPitch = composition.getTrack(trackNumber)[indx].getPitch();
				console.log("in composition " + currentPitch);
				
				if(currentPitch != "silence") {
					var inst = composition.getInstrument(trackNumber);
					var instObject = instrumentObjects[allInstruments.indexOf(inst)];
					
					instObject.play({
						wait : (indx - startIndex) * beatDuration,
		 			    pitch : currentPitch,
		 				label : "playing"
					});
					
		 		} else {
		 			quarterRest.play({
					    wait : (indx - startIndex) * beatDuration,
						label : "playing" 
		 			});
		 		}
		    }
	    }
	}
}

function findMaxLength(){
    var max = 0;
	var numOfTracks = composition.getNumTracks();
	
	for(counter = 0; counter < numOfTracks; counter++){
	    if(composition.getTrack(counter).length >= max){
		    max = composition.getTrack(counter).length;
		}
	}
	
	return max;
}

function playAllSequences() {

    console.log("max length = "  + findMaxLength());
    console.log("start index = " + startPlayingFrom);
		
	if(playUntil == -1){
	    playUntil = findMaxLength() - 1;
	}
	
	for (counter = 0; counter < composition.getNumTracks(); counter++) {
	
	    var tempEnd = Math.min(composition.getTrack(counter).length - 1, playUntil);
		console.log('tempEnd at ' + tempEnd + "for track " + counter);
		
		if(tempEnd > -1) {
		    playSequence(counter, startPlayingFrom, tempEnd);
			
		}
	}
}

//empty the note array    
function clearAllSound(){
	var numOfTracks = composition.getAllTracks().length;
	
	for (i = 0; i < numOfTracks; i++) {
		composition.setEnablePlaying(i, false);
		composition.emptyAllTracks(); // Empties all tracks
	}
	
	piano.stop("playing");
    synthGuitar.stop("playing");
	string.stop("playing");
	flute.stop("playing");
	bell.stop("playing");
	
    if(enableLooping){
	    document.getElementById("startLoop").value = "Start Looping";
        document.getElementById("startLoop").innerHTML = "Start Looping";
	    clearInterval(loopId);
	
    }
	
	for (i = 0; i < numOfTracks; i++) {
		composition.setEnablePlaying(i, true);
		//set back to normal
	}
	
}



function animateAll(){
console.log("HEY!!!!!!!!!!!!!!!!!!!!!!!!!!!" + "numOfTracks= " + composition.getNumTracks());
    var beatDuration = composition.getBeatDuration();
	
	for(trackIndx = 0; trackIndx < composition.getNumTracks(); trackIndx++){
	console.log("ENABLEPLAYING " + composition.isEnablePlaying(trackIndx));
       if(composition.isEnablePlaying(trackIndx)){
	        animation.playAnimation(beatDuration * 1000, beatDuration * (playUntil - startPlayingFrom + 1) * 1000, startPlayingFrom, playUntil, trackIndx);
	    }
	}
}

function loopAll(){
	var beatDuration = composition.getBeatDuration();
	
	if(document.getElementById("startLoop").value == "Start Looping"){//currently stop, now we want to start
    	enableLooping = true;
	    document.getElementById("startLoop").value = "Stop Looping";//change to stop
		document.getElementById("startLoop").innerHTML = "Stop Looping";//change to stop
	
		playAllSequences();
		//console.log("from " + startPlayingFrom + " to " + playUntil);
		animateAll();
		loopId = setInterval("playAllSequences()", beatDuration * (playUntil - startPlayingFrom + 1) * 1000);  
		animationLoopId= setInterval("animateAll()", beatDuration * (playUntil - startPlayingFrom + 1) * 1000);
		console.log("loopId" + loopId);
		console.log("animationLoopId" + loopId);
 		
	} else {//if we want to stop
	
	    enableLooping = false;
	    document.getElementById("startLoop").value = "Start Looping";
		document.getElementById("startLoop").innerHTML = "Start Looping";
	    clearInterval(loopId);
        clearInterval(animationLoopId);		
		
		startPlayingFrom = 0;//change back to default
	    playUntil = -1;//change back to default
	
	}
}
/*
function exportAudio(){
    record();
	playAllSequences();
}
*/

// Adds a track to user composition and updates user interface
// respectively
function addTrack(numTracks) {
	var newTrack = $(".track").first().clone();
    var currentTrackIndex = numTracks - 1;
   
    
	// For play button
	newTrack.children().eq(0).children().attr('id', "play-track" + currentTrackIndex);
	
	//Instrument
	newTrack.children().eq(0).children().eq(2).attr('id', "Instrument" + currentTrackIndex);
	newTrack.children().eq(0).children().eq(2).html("Piano");
	//console.log("debugging cloning instruments " + newTrack.children().eq(0).children().eq(2).attr('id') + "under class " + newTrack.children().eq(0).children().eq(2).attr("class"));
	
	// For track number
	newTrack.children().eq(1).attr('id', "track" + currentTrackIndex);

	// Appending to timeline-system
	newTrack.appendTo("#timeline-system");
	$("#track" + currentTrackIndex + " .sortable-system div").remove();
	
}

//Change the look of all notes on the timeline
//Also makes every 4 consecutive notes have a darker shade
function updateTimelineNotes() {
	var trackSelector = "#track";
	var sortableDivSelector = " .sortable-system div";
	var numOfTracks = composition.getAllTracks().length;
	var numOfNotes = 0; // Default 0 notes
	var alternate = 0;
	var selector;
	
	for (trackNum = 0; trackNum < numOfTracks; trackNum++) {
		selector = trackSelector + trackNum + sortableDivSelector;
		numOfNotes = composition.getTrack(trackNum).length;
		
		for (noteNum = 0; noteNum < numOfNotes; noteNum++) {
			alternate = parseInt(noteNum/4);
			
			if (alternate % 2 == 0) { // even sections of 4 notes
				$(selector).eq(noteNum).css({
					"background": "#109bce"
				});
			} else { // odd sections of 4 notes
				$(selector).eq(noteNum).css({
					"background": "#0b6688"
				});
			}
		}
	}
	
	$(".sortable-system div").not(".ui-sortable-placeholder").removeClass().css({
		"padding-top": "15px",
		"border-radius": "1em",
		"display": "inline-block",
		"vertical-align": "top",
		"text-align": "center",
		"font-size": "20px",
		"color": "#FFFFFF",
		"text-shadow": "1px 1px 2px #000000"
	});
}


/*--------------------------------------------------------*/
/*-----------------Utility Functions----------------------*/
/*--------------------------------------------------------*/
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

function generateOctaveColour(colour) {
	var coloursList = [["#005C99", "#007ACC", "#0099FF", "#33ADFF", "#66C2FF", "#99D6FF"], // Blue
	                   ["#1A661A", "#248F24", "#2EB82E", "#47D147", "#70DB70", "#D1FFC2"], // Green
	                   ["#B24700", "#E65C00", "#FF6600", "#FF8533", "#FFA366", "#FFB280"], // Orange
	                   ["#B20000", "#E60000", "#FF0000", "#FF3333", "#FF4D4D", "#FF8080"], // Red
	                   ["#FFFFFF"]]; // White
	var numOfOctaves = 6;
	var octaveHolder = $(".octave-holder");
	var chosenColour = 0; //Blue by default
	var flatsList = [1, 3, 6, 8, 10]; // Index of flats/sharps on each octave
	
	if (colour == "blue") {
		chosenColour = 0;
	} else if (colour == "green") {
		chosenColour = 1;
	} else if (colour == "orange") {
		chosenColour = 2;
	} else if (colour == "red") {
		chosenColour = 3;
	} else if (colour == "white") {
		chosenColour = 4;
	}
	
	for (octaveNum = 0; octaveNum < numOfOctaves; octaveNum++) {
		
		if (chosenColour == 4) { // For white, almost like piano keys' colour
			octaveHolder.eq(octaveNum).find(".col-md-1").css({
				"background": "#FFFFFF",
				"color": "black",
				"text-shadow": "none"
			});
			
			$("#show-less-octave-holder").children().css({
				"color": "black",
				"text-shadow": "none"
			});
			
		} else {
			// All notes in the octave
			octaveHolder.eq(octaveNum).find(".col-md-1").css({
				"background": coloursList[chosenColour][octaveNum],
				"color": "white",
				"text-shadow": "1px 1px 0px #000000"
			});
			
			$("#show-less-octave-holder").children().css({
				"color": "white",
				"text-shadow": "1px 1px 0px #000000"
			});
			
		}
		
		// Style of flat/sharp notes
		for (noteNum = 0; noteNum < 12; noteNum++) {
			for (flatNum = 0; flatNum < 5; flatNum++) {
				if (noteNum == flatsList[flatNum]) {
					octaveHolder.eq(octaveNum).children().eq(noteNum).css({
						"background": "black",
						"color": "white",
						"font-size": "22px"
					});
				}
			}
		}
	}
	
}


/*------------------------------------------------*/
/*--------Document interaction with JQuery--------*/
/*------------------------------------------------*/
$(document).ready(function() {
    $("#tips").on("click", function(){
	    $("#slideshow").toggle();
	});
	
    $("#slideshow > div:gt(0)").hide();

    setInterval(function() {
	    $('#slideshow > div:first')
	    .fadeOut(1000)
	    .next()
	    .fadeIn(1000)
	    .end()
	    .appendTo('#slideshow');
    },  6000);
	
	
	
	function initialize() {
		initializeTrackSettings();
		readSaveData();
		
		$(".col-md-1").unbind("click").on("click", function() {
			var noteName = $(this).attr('data-note');
			console.log(noteName);
			
			if(noteName != "silence"){
			    piano.play({ 
				    pitch : notes[parseInt(noteName)] 
			    });
			} else {
				// Do nothing to mimic silence...ooh
			}
			
		});
		
		// On drag start for a note, prevent the window from annoyingly
		// scrolling as user drags note.
		$(".col-md-1").unbind("mousedown").on("mousedown",function() {
			$(".notes-buttons-holder").css({
				"overflow": "hidden"
			});
			
			// On drag stop, revert back to the scrollbar
			$(this).on("dragstop", function() {
				$(".notes-buttons-holder").css({
					"overflow": "auto"
				});
			});
			
		}).on("mouseup", function() {
			$(".notes-buttons-holder").css({
				"overflow": "auto"
			});
		});
		
		$("#all").on("click", function() {
			playAllSequences();
			startPlayingFrom = 0; //change back to default
			playUntil = -1; //change back to default
		});
		
		$("#stop").on("click", function() {
			enableLooping = false;
			
		    piano.stop("playing");
		    synthGuitar.stop("playing");
			string.stop("playing");
			flute.stop("playing");
		    bell.stop("playing");
			
		    startPlayingFrom = 0;//change back to default
			playUntil = - 1;//change back to default
		    animation.stopAnimation();
			    
		    	document.getElementById("startLoop").value = "Start Looping";
			    document.getElementById("startLoop").innerHTML = "Start Looping";
		        clearInterval(loopId);
				clearInterval(animationLoopId);
			
		});
		
		$("#clear").on("click", function() {
			
			$(".sortable-system div").remove(); //remove notes from the timeline
		    enableLooping = false;
			clearAllSound();
			
			animation.stopAnimation();
			startPlayingFrom = 0;//change back to default
			playUntil = - 1;//change back to default
			    document.getElementById("startLoop").value = "Start Looping";
			    document.getElementById("startLoop").innerHTML = "Start Looping";
		        clearInterval(loopId);
				clearInterval(animationLoopId);
			
		});
		
		$("#startLoop").on("click", function() {
		    enableLooping = true;
		    if(findMaxLength() > 0)loopAll();
	    });	
		
		$("#addTrack").on("click", function() {		
			//  First add a new track to our composition
			composition.addTrack([]);
			
			addTrack(composition.getNumTracks());
			
			// Must reinitialise the sortables
			setSortable();
			initializeTrackSettings();
		});
		
		$("#saveData").on("click", function() {
			//setUpMIDI();
			writeSaveData();
			$(this).html("Saved!");	
        });
			
		
		/*
        $("startRec").on("click", function(){
		    exportAudio();
		});

		$("stopRec").on("click", function(){
		    stop();
		});
		*/
		// Selecting the octaves for show less view
		$("#octave-num li a").on("click", function() {
			var octaveDisplaySelector = $("#dropdown-selection");
			var dropdownList = $("#octave-num li a");
			var octaveNum = parseInt($(this).text());
			var octaveDisplayed = octaveDisplaySelector.text();
			var dropdownIndex = $(this).parent().attr("data-index");
			
			octaveDisplaySelector.html(octaveNum + " <span class='caret'></span>");
			
			dropdownList.eq(dropdownIndex).text(octaveDisplayed + ""); // Update octave num displayed to new
			dropdownList = $("#octave-num li a"); // Update to new dropdown list
			
			/* Rearranging the dropdown list in ascending order */
			var dropdownListNums = [];
			
			for (index = 0; index < 5; index++) {
				dropdownListNums.push(parseInt(dropdownList.eq(index).text()));
			}
			
			dropdownListNums.sort();
			
			for (index = 0; index < 5; index++) {
				dropdownList.eq(index).text(dropdownListNums[index]);
			}
			
			/* Making the notes play the correct pitches & octaves */
			var notesInCurrentOctave = $(".octave-holder-less .col-md-1");
			
			for (noteIndex = 0; noteIndex < 12; noteIndex++) {
				notesInCurrentOctave.eq(noteIndex).attr('data-note', noteIndex + (octaveNum - 2) * 12);//C3= 12?
			}
			
		});
		
		// Notes Palette Left Toolbar options
		$("#buttons").draggable({ 
			axis: "y",
			cursor: "row-resize",
			containment: ".workspace",
			handle: "#move-vertical-button",
			start: function(event, ui) {
				$(this).animate({
					opacity: '0.5'
				});
			},
			stop: function(event, ui) {
				$(this).animate({
					opacity: '1.0'
				});
			}
		});
		
		$("#show-button").on("click", function() {
			$("#show-less-view").toggle();
			$("#show-more-view").toggle();
		});
		
		$("#colour-button").on("click", function() {
			var coloursList = ["blue", "green", "orange", "red", "white"];
			var buttonColour = ["#109bce", "#248F24", "#E65C00", "#E60000", "#FFFFFF"];
			var currentColour = coloursList[buttonColour.indexOf(composition.getOctaveColour())];
			var nextColour = coloursList[(coloursList.indexOf(currentColour) + 1) % coloursList.length];
			
			composition.setOctaveColour(nextColour);
			generateOctaveColour(nextColour);
			
			$(this).css({
				"background-color": composition.getOctaveColour()
			});
			
			$("#show-less-octave-holder div").css({
				"background-color": composition.getOctaveColour()
			});
			
		});
		
	}
	
	function initializeTrackSettings() {
		//to select a note to play FROM, click the note and hold the Shift key
		//to select a note to play UNTIL, double click the note 
		//to delete all the colors, press Stop and start all over again fresh!!!
		
		$(".play-button").unbind().on("click", function() {
			var trackNum = parseInt($(this).attr('id').substring(10));
			var trackLength = composition.getTrack(trackNum).length;
			console.log(startPlayingFrom);
			console.log(playUntil);
			if(playUntil == -1) {
				    playUntil = trackLength - 1;
			}
		    
			console.log("playUntil in play-button: " + playUntil);
			
			playSequence(trackNum, startPlayingFrom, playUntil);
			startPlayingFrom = 0;//change back to default
			playUntil = - 1;//change back to default
			
			
		});
		
		$(".muteButton").unbind().on("click", function() {
			var trackNum = parseInt($(this).prev().attr('id').substring(10));
			
			composition.setEnablePlaying(trackNum, !composition.isEnablePlaying(trackNum));
			// Toggles whether a track is playing or not in composition's list of boolean values
			// for each track
			
			if (!composition.isEnablePlaying(trackNum)) {
				// When users click to mute track.
				$(this).css({
					"padding": "3px 10px 3px 2px",
					"border": "none",
					"background-color": "#c0c0c0", // Greyed out effect
					"color": "#FFFFFF"
				}).html("Unmute");
				$()
				// Grey out the timeline that is muted
				$(this).parent().parent().css({
					"background-color": "grey"
				});
			} else {
				// When users click to unmute track.
				$(this).css({
					"padding": "3px 10px 2px 10px",
					"border": "1px solid #000000",
					"background-color": "#575757", // Back to normal effect :)
					"color": "#e2e2e2"
				}).html("Mute");

				// Return timeline to original css white when unmuted
				$(this).parent().parent().css({
					"background-color": "white"
				});
			}
			
		});
		
	    $(".displayInstrument").unbind().on("click", function(){
	        var trackNum = parseInt($(this).prev().prev().attr('id').substring(10));
			var instrument = document.getElementById("Instrument" + trackNum);//current instrument at the specific track number
			var currentInstrument = instrument.textContent;
			var currIndex = allInstruments.indexOf(currentInstrument);
		    var nextInstrument = allInstruments[(currIndex + 1) % allInstruments.length];
		    composition.setInstrument(trackNum, nextInstrument);
		    instrument.textContent = nextInstrument;
      
	    });
		
		$(".close-panel").unbind().hover(function(event) {
			// Controls the animation of close track button
			$(this).children(".close-button").stop().animate({
				width: event.type=="mouseenter" ? 20: 0,
				fontSize: event.type=="mouseenter" ? "15px": 0
			}, 500);
			
		}).on("click", function(event) {
			var trackSystem = $("#timeline-system");
			var numOfTracks = trackSystem.children().length;
			
			if (numOfTracks > 1) {
				// To remove track from our backend first
				var trackNumToBeRemoved = parseInt($(this).parent().attr("id").substring(5));
				composition.deleteTrack(trackNumToBeRemoved);
				
				// To actually remove track from DOM in html
				$(this).parents(".track").remove();
				
				// To update all the IDs of the remaining tracks
				var numOfTracksRemaining = numOfTracks - 1;
				
				for (trackIndex = 0; trackIndex < numOfTracksRemaining; trackIndex++) {
					// Change ID of all tracks' play buttons
					trackSystem.children().eq(trackIndex).find(".play-button").attr('id', "play-track" + trackIndex);
					// Change ID of each track
					trackSystem.children().eq(trackIndex).children().eq(1).attr('id', "track" + trackIndex);
				}
			} else {
				alert("Can't delete last remaining track!");
			}
		});
		
	}
	
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
							  timelineHeight - 17);
	
	// Generate initial grid
	grid.generateGrid(1, numOfDivisions);
	
	// Ensures timeline dimensions are always updated after resizing webpage
	$(window).on("resize", function () {
		grid.resizeGrid();
	});

	
	/*------------------------------------------------*/
	/*------------ Initialize EVERYTHINGG-------------*/
	/*------------------------------------------------*/
	
	// If the user has saved a composition before, let's not 
	// burden them with the tutorial again
	if (localStorage.getItem("userComposition") == null) {
		introJs("body").start();
	}
	
	setSortable();
	initialize();
	initializeTrackSettings();
	generateOctaveColour("blue"); // default, but save data may overwrite this later
	$("#show-less-view").hide();
	
	
	
	
	/*------------------------------------------------*/
	/*------------ Draggables & Sortables-------------*/
	/*------------------------------------------------*/
	// Function to update composition's tracks and notes for the user
	// Whenever a note is inserted or swapped in sortable.
	// This checks for objects in the DOM and updates our backend composition
	// respectively.
	function updateComposition() {
		var numOfTracks = $(".timeline").length;
		var trackNotes, dataNoteIndex, currentTrack, currentNote, noteDataAttr;
		
		composition.emptyAllTracks();
		
		for (trackNum = 0; trackNum < numOfTracks; trackNum++) {
			
			currentTrack = $("#track" + trackNum + " > :nth-child(2)");
			// nth-child(2) because our sortable system is always 2nd child
			
			trackNotes = currentTrack.children();
			// list of a track's notes
			
			for (noteNum = 0; noteNum < trackNotes.length; noteNum++) {
				noteDataAttr = trackNotes.eq(noteNum).attr('data-note');
				
				if (noteDataAttr != "silence") {
					dataNoteIndex = parseInt(noteDataAttr);
					currentNote = new Note(notes[dataNoteIndex]);
					
				} else {
					currentNote = new Note(noteDataAttr);
				}
					
				composition.addNote(trackNum, currentNote);
			}
		}
	}
		
	function setSortable() {	
		$(function() {
			var inBox = false; // Flag that facilitates removal of note
			var inBeforeStop = false; // Flag that facilitates colour of note when removed
			var trackNumInSortable = 0; // Current/default trackNum
			
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
				
				stop: function() {
					updateTimelineNotes();
				},
				
				start: function(event, ui) {
					var startPosition = ui.item.index(); //original index
					ui.item.data('startPos', startPosition); //create data called startPos and set it to startPosition
					
					trackNumInSortable = parseInt(ui.item.parent().parent().attr("id").substring(5));
				},
				
				// Whenever user has stopped sorting and the DOM element (HTML) has changed
				update: function(event, ui) {
					updateComposition();
					updateTimelineNotes();
					
					$("#saveData").html("Save");
				},
				
				// If item is hovering over timeline
				over: function(event, ui) {
					inBox = true;
					inBeforeStop = false;
					
					ui.item.css({
						"border":"none",
					});
					
				},
				 
				// If item is dragged outside timeline OR if item is dropped
				// onto timeline
				out: function(event, ui) {
					inBox = false;
					
					if (!inBeforeStop) {
						ui.item.css({
							"border": "5px solid red",
							"background": "red"
						});
					}
					
				},
				
				// Just before releasing dragging and item is outside timeline
				beforeStop: function(event, ui) {
					inBeforeStop = true;
					
					// If a note is not swapped to another track or user decides
					// not to delete a note, the note will not enter this and be removed
					if (!inBox) {
						var startPosition = ui.item.data('startPos');
						composition.getTrack(trackNumInSortable).splice(startPosition, 1);
						ui.item.remove();
					}
					
				},
				
				// When timeline receives the user-dragged note
				receive: function(event, ui) {
					// Add correct note (and pitch) to tracks
					if(ui.item.attr('data-note') != "silence"){
			      		var insertedNote = new Note(notes[parseInt(ui.item.attr('data-note'))]);
						composition.addNote(trackNumInSortable, insertedNote);
						
					} else {
						var insertedSilence = new Note(ui.item.attr('data-note'));

						composition.addNote(trackNumInSortable, insertedSilence);
					}
					
					// Set style of notes on timeline
					updateTimelineNotes();
					$(".sortable-system div").not(".ui-sortable-placeholder").css({
						"height": grid.noteHeight,
						"width": grid.noteWidth
					});	
					
					$(".sortable-system div").on("click", function(e){
					    //$(".sortable-system div").css({ "border": "none" });    //comment this line first to allow choosing of starting and ending note
						// To ensure if user clicks on more than 1 note, the prev note click
						// will have its border color reverted.
						var notePressed = $(e.target);
						var trackNum = parseInt(notePressed.parent().parent().attr('id').substring(5));
					    var noteDataAttribute = notePressed.attr('data-note');
						
					    if (noteDataAttribute != "silence") {
							var instrumentInThisTrackString = composition.getInstrument(trackNum);
							var instrumentInThisTrackObj = instrumentObjects[allInstruments.indexOf(instrumentInThisTrackString)];
					    	
							instrumentInThisTrackObj.play({
							    pitch : notes[parseInt(noteDataAttribute)]
							});
					    } else {
					    	quarterRest.play({
					    		label: "playing"
					    	});
					    }
						
					    notePressed.css({ 
					        "background": "#80ffff" //change color to light blue
					    });
						
						setTimeout(function(){
						    updateTimelineNotes(); //change back to original
						}, 400);
						
						if(e.shiftKey){//Mouse Click+shift event to choose the first note to play
							notePressed.css({ "border": "1px solid red" });
							startPlayingFrom = $(e.target).index();
						}
					});
				
					$(".sortable-system div").on("dblclick", function(e){
						$(e.target).css({ "border": "1px solid yellow" });
	                    playUntil = $(e.target).index();
	                    
						console.log("first note " + startPlayingFrom);
						console.log("last note " + playUntil);
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
	
	

	
	//Preparing for our random PI song	
	
	//generating the song of PI
	var piSong = function(pivot, numOfNotes){//num of notes to add on top of the pivot
	    var timesTen = pi * Math.pow(10, numOfNotes - 1);
		songOfPi.push(notes[pivot]);
		
		for(count = numOfNotes; count >= 0; count--) {
	        var div = Math.floor(timesTen / (Math.pow(10, count - 1)));
			console.log("div" + div);
			var mod = timesTen % (Math.pow(10, count - 1));
			
			timesTen = mod;
			songOfPi.push(notes[pivot + div]);
		}
	}				
	
	var randomStart;
		
	var playSongOfPi = function() {
	    //initiate random variables
	    var randomLength = function(){
	        var result;
	        
	        if(Math.random() > 0.5 ) { 
		        result = Math.floor(Math.random() * Math.random() * 1099) % 41;
		    } else {
		        result = Math.floor(Math.random() * Math.random() * 1099) % 41 + 20;
		    }
	        
		    if(result < 10) {
			    result += 15;
			}
		
			return result;
		
	    }
		
		console.log("done choosing length");
		
	    var randomPivot = function(){
		    var result = Math.floor(Math.random() * Math.random() * 2999) % 60;
			
			if(result < 10) {
			  console.log("too low!!");
			  result += 5;
			} else if(result > 55) {
			  console.log("too high!!");
			  result -= 10;
			}
			   
			return result;
	    }
		
		console.log("done choosing pivot");
	    piSong(randomPivot(), randomLength());
		console.log(songOfPi.length);	
	    //play out from any index of the song of PI	
	    randomStart = Math.floor(Math.random() * 1099) % randomLength(); 
		console.log("randomStart = " + randomStart);
	    console.log("random pivot " + randomPivot());
	    console.log("random length " + randomLength());
	    for(count = randomStart; count < songOfPi.length; count++){
	    	console.log(songOfPi[count]);
	    	
	    	piano.play({
	    		wait : composition.getBeatDuration() * (count - randomStart),
	    		pitch: songOfPi[count],
				label: 'playing'
	    	});
	    }
	}
			
	$("#randomPI").on("click", function(){
		   console.log("before for loop");
		   playSongOfPi();
     	   
		   for(index = randomStart; index < songOfPi.length; index++){
			   console.log("in for loop");
			   $("div").each(function(){
				   if($(this).hasClass("col-md-1")) {
					   if($(this).attr("data-note") != "silence" && parseInt($(this).attr("data-note")) == notes.indexOf(songOfPi[index])){
						   console.log($(this).attr("data-note") + " and " + songOfPi[index]);
						   
						   var tempNote = $(this).clone();
						   
						   $("#track0").children().eq(1).append(tempNote);
						   updateTimelineNotes();
						   console.log("index " + tempNote.index());
						   composition.getTrack(0).push(new Note(notes[parseInt(tempNote.attr('data-note'))], composition.getBeatDuration()));
					   
					   }
					
				   }
				   
			   });
		   }
			
		   //console.log("after for loop");
		   console.log("end at " + playUntil);
		   songOfPi = [];
		   
		   // For styling all random notes on timeline
		   $(".sortable-system div").not(".ui-sortable-placeholder").css({
				"height": grid.noteHeight,
				"width": grid.noteWidth
		   });
		   
		   updateTimelineNotes();
		   
	});

	/*------------------------------------------------*/
	/*------------- User save/read data---------------*/
	/*------------------------------------------------*/
	// User save data/ read data to/from localStorage of 
	// browser for future sessions

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
		console.log("written save data");
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
		
		// Add a track for every track in composition and populate those tracks
		// with the user's notes
		for (track = 0; track < numOfTracks; track++) {
			
			// Add a track first
			if (track >= 1) {
				addTrack(track + 1);
			}
			
			// Change instruments to the right ones for each track
			$("#Instrument" + track).html(composition.instruments[track]);
			
			for (note = 0; note < composition.getTrack(track).length; note++) {
				composition.getTrack(track)[note] = $.extend(new Note(), composition.getTrack(track)[note]);
				// explicitly associates noteOnTrack with Note class for every note in the composition.
				
				var noteOnTrack = composition.getTrack(track)[note];
				// reference to the new note object
				
				var notePitch = noteOnTrack.getPitch();
				var noteOpacity = 1.0;
				var dataNoteParameter = "C4"; //Default data note parameter in case of error
				
				if (notePitch == "silence" || notePitch == undefined) {
					notePitch = "Rest";
					noteOpacity = 0.5;
					dataNoteParameter = "silence";
					composition.getTrack(track)[note].setPitch("silence");
				} else {
					dataNoteParameter = notes.indexOf(notePitch);
				}
				
				var noteHTML = "<div class data-note='" + dataNoteParameter + 
							   "' style='opacity: " + noteOpacity + "; display: inline-block; width: 39.0625px; " +
							   "height: 61px; z-index: 0; border: none; padding-top: 15px; " +
							   "border-radius: 1em; vertical-align: top; text-align: center; " +
							   "font-size: 20px; color: rgb(255, 255, 255); " +
							   "text-shadow: rgb(0, 0, 0) 1px 1px 2px; background: rgb(16, 155, 206); '>" +  
							   notePitch + "</div>";
				// Mimics the style of a note on timeline
				
				$("#track" + track).children().eq(1).append(noteHTML);
			
			}
			
		}
		
		// This section settles muted tracks
		var tracksEnablePlaying = composition.enablePlaying;
		var trackMuteButton;
		
		for (mutedTrack = 0; mutedTrack < tracksEnablePlaying.length; mutedTrack++) {
			if (!tracksEnablePlaying[mutedTrack]) { //false --> Contains a muted track
				trackMuteButton = $("#timeline-system").children().eq(mutedTrack).find(".muteButton");
				
				// CSS of a muted track.
				trackMuteButton.css({
					"padding": "3px 10px 3px 2px",
					"border": "none",
					"background-color": "#c0c0c0", // Greyed out effect
					"color": "#FFFFFF"
				}).html("Unmute");
				
				// Grey out the timeline that is muted
				trackMuteButton.parent().parent().css({
					"background-color": "grey"
				});
			}
		}
		
		// Reinitialise track settings and sortables for all newly made tracks
		initializeTrackSettings();
		setSortable();
		grid.resizeGrid();
		updateTimelineNotes();
		setBPMinput();
		
		// Reinitialise octave colours for users
		generateOctaveColour(composition.getOctaveColourString());
		$("#colour-button").css({
			"background-color": composition.getOctaveColour()
		});
		
		$("#show-less-octave-holder div").css({
			"background-color": composition.getOctaveColour()
		});
	}

	readSaveData(); // Should be put last after all user 
					// interface DOM elements have been set up
	
});



//ABORTED CODES

   /*
		//piano- guitar- violin
		$(".chooseInstrument").click(function(){
		    var trackNum = parseInt($(this).attr('id').substring(10));
		   	
				$(".chooseInstrument").each(function(){
				    var self = $(this);
		         console.log("check inside chooseInstrument " + $(self).attr('id'));
				 });
				 
		            console.log("after check, in choose inst " + $(this).attr('id'));
			        var currIndex = allInstruments.indexOf($(this).value);
			        var nextInstrument = allInstruments[(currIndex + 1) % allInstruments.length];
		
			        instruments[trackNum] = nextInstrument;
			        $(this).value = nextInstrument;
			        $(this).innerHTML = nextInstrument;
          
		        
		 });   
		*/	   

/*

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
*/


/*
		    $(".displayInstrument").unbind().hover(function(event){
			    console.log("YAHA!");
				var trackNum = parseInt($(this).prev().prev().attr('id').substring(10));
			    $("#timeline-system").children().eq(trackNum).find(".instrumentMenu").stop().animate({
				height: event.type=="mouseenter" ? 50: 0,
				//fontSize: event.type=="mouseenter" ? "15px": 0
			}, 100);
			});
		*/
		
		/*
		    $(".track-settings ul.instrumentMenu li a").unbind().on("click", function(){
			    console.log($(this).attr('id'));
				var trackNum = parseInt($(this).parent().prev().prev().attr('id').substring(10));
				$("#timeline-system").children().eq(trackNum).find(".displayInstrument").value = $(this).attr('id');
			    $("#timeline-system").children().eq(trackNum).find(".displayInstrument").innerHTML = $(this).attr('id');
                instruments[trackNum] = $(this).attr('id');				
				//});
		    });
		
		*/
		

/*  
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
		*/
		//end pause
/*
 * How to use the below 2 functions for notes div generation:
 * Uncomment the "console.log(generateNotes);"
 * Copy n Paste the generate string of divs from the console on Chrome/Firefox 
 * and paste DIRECTLY to the correct place in index.html.
 * This is to speed up page load ups - it improves performance.
 *
// Generate notes divs
function generateNotes() {
	var allNotesDivs = "";
	var result = "";
	var octaveClassName = "octave-holder";
	var numOfOctaves = 6;
	var numOfNotesInOctave = 12;
	//var restDiv = "<div style='font-size: 20px;' class='col-md-1' data-note='silence'>Rest</div>";
	
	for (octaveNum = 0; octaveNum < numOfOctaves; octaveNum++) {
		
		allNotesDivs = ""; // refresh allNotesDiv for the next octave's notes
		result += "<div class='" + octaveClassName + "'>";
		
		for (noteNum = 0; noteNum < numOfNotesInOctave; noteNum++) {
			var noteIndex = noteNum + (octaveNum * numOfNotesInOctave);
			
			allNotesDivs += generateNotesDivs(noteIndex, notes[noteIndex]);
		}
		
		result += allNotesDivs + "</div>";
		
	}
	
	return result;
}

function generateNotesDivs(dataNote, noteName) {
	var result = '<div class="col-md-1" data-note=' + dataNote + '>' + noteName + '</div>';

	return result;
}

console.log(generateNotes());
*/

/*
------------------------------------
----------CODE ON HOLD--------------
------------------------------------
//RECORDING
	
//https://truongtx.me/2014/08/09/record-and-export-audio-video-files-in-browser-using-web-audio-api/	

/*
    function record() {
     // ask for permission and start recording
      navigator.getUserMedia({audio: true}, function(localMediaStream){
       mediaStream = localMediaStream;

    // create a stream source to pass to Recorder.js
       var mediaStreamSource = context.createMediaStreamSource(localMediaStream);

    // create new instance of Recorder.js using the mediaStreamSource
       rec = new Recorder(mediaStreamSource, {
      // pass the path to recorderWorker.js file here
        workerPath: 'Recorderjs/recorderWorker.js'
       });

    // start recording
        rec.record();
		playAllSequences();
		
      }, function(err){
           console.log('Browser not supported');
        });
   }
   */
/*

    function stop() {
       // stop the media stream
       mediaStream.stop();

       // stop Recorder.js
       rec.stop();
/*
       // export it to WAV
       rec.exportWAV(function(e){
       rec.clear();
       Recorder.forceDownload(e, "musision.wav");
       });
	   */
/*	   
	function upload(blobOrFile) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload.aspx', true);
        xhr.onload = function (e) {
           var result = e.target.result;
        };

        xhr.send(blobOrFile);
    }
*/
// stop recording function calls the upload method
// I am using recorder.js
/*
        rec.exportWAV(function (blob) {
            var url = URL.createObjectURL(blob);
            audio.src = url;
            audio.controls = true;
            var hf = document.createElement('a');
            hf.href = url;
            hf.download = new Date().toISOString() + '.wav';
            upload(blob);   
        });
		
 }	
//});
*/
	
	
	/*
	
	$("#saveData").on("click", function(){
	    var audio_context;

        function __log(e, data) {
          log.innerHTML += "\n" + e + " " + (data || '');
        }

        $(function() {

            try {
            // webkit shim
                window.AudioContext = WINDOW.AudioContext || window.webkitAudioContext;
                navigator.getUserMedia = ( navigator.getUserMedia ||
                     navigator.webkitGetUserMedia ||
                     navigator.mozGetUserMedia ||
                     navigator.msGetUserMedia);
                window.URL = window.URL || window.webkitURL;

            var audio_context = new AudioContext;
            __log('Audio context set up.');
            __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not  present!'));
           } catch (e) {
                alert('No web audio support in this browser!');
           }

        $('.recorder .start').on( 'CLICK', function() {
            $this = $(this);
            $recorder = $this.parent();

            navigator.getUserMedia({audio: true}, function( STREAM) {
            var recorderObject = new MP3Recorder(audio_context, STREAM, { statusContainer:  $recorder.find('.status'), statusMethod: 'replace' });
            $recorder.data('recorderObject', recorderObject);

            recorderObject.start();
            }, function(e) { });
        });

        $('.recorder .stop').on( 'CLICK', function() {
            $this = $(this);
            $recorder = $this.parent();
        
            recorderObject = $recorder.data('recorderObject');
            recorderObject.stop();
        
            recorderObject.exportMP3(function(base64_mp3_data) {
                var url = 'data:audio/mp3;base64,' + base64_mp3_data;
                var au  = document.createElement('audio');
                au.controls = true;
                au.src = url;
                $recorder.append(au);
          
            recorderObject.logStatus('');
            });

        });

    });
});	
	


	//from wad.js documentation
	var sine = new Wad({source : 'sine'})
var mixerTrack = new Wad.Poly({
    recConfig : { // The Recorder configuration object. The only required property is 'workerPath'.
        workerPath : '/src/Recorderjs/recorderWorker.js' // The path to the Recorder.js web worker script.
    }
})
mixerTrack.add(sine)

mixerTrack.rec.record()             // Start recording output from this PolyWad.
sine.play({pitch : 'C3'})           // Make some noise!
mixerTrack.rec.stop()               // Take a break.
mixerTrack.rec.record()             // Append to the same recording buffer.
sine.play({pitch : 'G3'})
mixerTrack.rec.stop()
mixerTrack.rec.createWad()          // This method accepts the same arguments as the Wad constructor, except that the 'source' is implied, so it's fine to call this method with no arguments. 
mixerTrack.rec.recordings[0].play() // The most recent recording is unshifted to the front of this array.
mixerTrack.rec.clear()              // Clear the recording buffer when you're done with it, so you can record something else.	
	});
*/
	//end recorder.js


/*
	//from p5.js  at http://p5js.org/examples/examples/Sound__Record_Save_Audio.php
	
    var mic, recorder, soundFile;

    var state = 0; // mousePress will increment from Record, to Stop, to Play

    //function setup() {
    //    createCanvas(400,400);
     //   background(200);
       // fill(0);
        //text('Enable mic and click the mouse to begin recording', 20, 20);

  // create an audio in
        mic = new p5.AudioIn();

  // users must manually enable their browser microphone for recording to work properly!
        mic.start();

  // create a sound recorder
        recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
        recorder.setInput(mic);

  // create an empty sound file that we will use to playback the recording
        soundFile = new p5.SoundFile();
   // }
	
	



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