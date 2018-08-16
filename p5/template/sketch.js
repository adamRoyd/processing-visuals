var song, fft;
var a, b, c, d, e;

function preload() {
    song = loadSound('ice.mp3');
}

function setup() {

    createCanvas(640, 640);
    //noFill();
    // SONG SETUP
    song.loop();
    analyzer = new p5.Amplitude();
    analyzer.setInput(song);
    fft = new p5.FFT();
    fft.setInput(song);
    ///

}

function draw() {

    var spectrum = fft.analyze();
    var rms = analyzer.getLevel();


}
