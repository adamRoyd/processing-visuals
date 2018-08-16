


var song, fft;
var scaleX;
var scaleY;
var min;
var max;
var radius;
var r, g, b;

var runner;

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

    // put setup code here
    createCanvas(windowWidth, windowHeight);
    background(0);
    smooth();
    radius = 150;
    r = random(255);
    g = random(255);
    b = random(255);
    runner = 1;
    noCursor();

}

function drawEllipse() {
    noFill();
    stroke(r, g, b, 28);
    ellipse(0, 0, 120, 80);
}

function draw() {

    var spectrum = fft.analyze();
    var rms = analyzer.getLevel();

    

    fill(0, 25);
    rect(0, 0, windowWidth, windowHeight);

    radius = map(runner, 0, windowHeight, 200, 350);

    runner+= 1;


    r = norm(rms,0,0.1)*255;
    g =  norm(spectrum[600],0,1)*255;
    b = spectrum[2];

    console.log(spectrum.length);

    scaleX = map(runner, 0, windowWidth, 1.5, 11.5);
    scaleY = map(runner, 0, windowHeight, 1.5, 11.5);
    min = map(rms*100, 0, windowWidth, 0.1, 0.5);
    max = map(rms*100, 0, windowHeight, 0.8, 1.8);

    //background(0);
    translate(windowWidth / 2, windowHeight / 2);
    for (var i = 0; i < 360; i += 0.5) {
        push();
        rotate(radians(i));
        translate(0, radius);
        rotate(radians(i * 3));
        scale(map(sin(radians(i * scaleX)), -1, 1, min, max), map(sin(radians(i * scaleY)), -1, 1, min, max));
        drawEllipse();
        pop();
    }

}

function mouseMoved() {
    if (mouseX < (windowWidth/3)){
        //r = random(255);
        //r = map(mouseY, 0, windowHeight, 0, 255);
    } else if (mouseX > ((windowWidth/3)-windowWidth)){
        //b = random(255);
        //b = map(mouseY, 0, windowHeight, 0, 255);
    } else {
        //g = random(255);
        //g = map(mouseY, 0, windowHeight, 0, 255);
    }
    //radius = map(mouseY, 0, windowHeight, 100, 350);
}