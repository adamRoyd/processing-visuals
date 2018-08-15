var song, fft;

function preload() {
  song = loadSound('ice.mp3');
}


function setup() {
   createCanvas(710,400);
   //noFill();
   song.loop();

   //mic = new p5.AudioIn();
   //mic.start();
   fft = new p5.FFT();
   fft.setInput(song);
}

function draw() {
   background(200);

   var spectrum = fft.analyze();

   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0) );
   }
   endShape();
}