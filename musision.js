//The notes sequence array is borrowed from
//https://github.com/ValdemarOrn/valdemarorn.github.com/tree/master/Files/JSAudio 
//Thanks! :)
$(document).ready(function(){
           $('img').click(function(){
		      $('img').fadeOut('slow');
			  });
       });

    
	   
var data = [],
		sampleRateHz = 44100,
		
		//Notes sequence, play with it ;)
		notes = [62, 64, 66, 62, 62, 64, 66, 62],// 62, 64, 65, 67, 69, 71, 72, 60, 62, 63, 65, 67, 68, 70, 72],
		
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