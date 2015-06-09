/*------------------------------------*/
/*--------Document interaction--------*/
/*------------------------------------*/
var context = new AudioContext();

// Create Oscillator and gainNode
var oscillator = context.createOscillator();
var gainNode = context.createGain();

// Connect sound to speakers
// gainNode.connect(context.destination); 
// Note: You have to remove this above statement if you want 
// the signal to go through a gainNode, if not, oscillator will
// bypass gainNode

oscillator.connect(gainNode);
gainNode.connect(context.destination); 
// context.destination refers to your computer's audio output, 
// like speakers

var startOffset = 0;
var startTime = 0;

play(4);


function play(semitone) {
	var oscillator = context.createOscillator();
	oscillator.connect(context.destination);
	
	// Play a sine wave at A4 freq
	oscillator.frequency.value = 440;
	oscillator.detune.value = semitone * 100;
	oscillator.type = 'sine';
	oscillator.start(0);
	oscillator.stop(context.currentTime + 0.25);
}


// Play a source for some specified duration
function playSoundFor(sound, duration) {
	sound.start(0);
	sound.stop(context.currentTime + duration);
}

function midiToFreq(midiNum) {
	return 440 * Math.pow(2,((midiNum - 69) / 12));
}

$(document).ready(function() {
	

});

