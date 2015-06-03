
function simHertz(hz) {
    var audio = new Audio();
    var wave = new RIFFWAVE();
    var data = [];

    wave.header.sampleRate = 3000; //originally 44100

    var seconds = 2;//duration

    for (var i = 0; i < wave.header.sampleRate * seconds; i ++) {
        data[i] = Math.round(128 + 127 * Math.sin(i * 2 * Math.PI * hz / wave.header.sampleRate));
    }

    wave.Make(data);
    audio.src = wave.dataURI;
    return audio;
}

var audio = function(hz){
     return simHertz(hz);
	 }
	 //Observations:
	 //possible solution for now to use this: hard code all notes supplied from C1 to B8 using their frequencies!!
	 //when 2 or more buttons are pressed, the notes are played all at the same time. The first note does not stop before the full duration