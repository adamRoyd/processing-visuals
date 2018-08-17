var song, fft, amplitude;
var a, b, c, d, e;

var blockSize, circNum;
var isColorMode = true;
var bgClr = 250;
var colors = ['#2f4154', '#fb474d', '#74bfdd', '#D63826', '#0F4155', '#7ec873', '#4B3331', '#ee4035', '#fdf498', '#0392cf'];


// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 30;

// what amplitude level can trigger a beat?
var beatThreshold = 170; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 1;
var beatDecayRate = 0.7; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


function preload() {
    song = loadSound('eastwest.mp3');
}

function setup() {

    createCanvas(640, 640);
    //noFill();
    // SONG SETUP
    song.loop();
    amplitude = new p5.Amplitude();
    amplitude.setInput(song);
    amplitude.smooth(.09);
    fft = new p5.FFT();
    fft.setInput(song);
    ///

    strokeWeight(1.5);
    strokeCap(SQUARE);
    stroke(0, 10);

    genParcattern()

}

function draw() {

    var spectrum = fft.analyze();
    var level = amplitude.getLevel();

    //console.log(spectrum[3]);
    detectBeat(spectrum[3]);

}


function genParcattern() {
    circNum = ~~random(5, 10);
    blockSize = ~~random(30, 40);

    if (isColorMode) { bgClr = colors[colors.length - 1]; } else { bgClr = 250; }
    fill(bgClr); rect(0, 0, width, height);

    for (var y = blockSize / 2; y < height + blockSize / 2; y += blockSize) {
        for (var x = blockSize / 2; x < width + blockSize / 2; x += blockSize) {
            push();
            translate(x, y);
            rotate(HALF_PI * Math.round(random(10)));

            for (var i = circNum; i > 0; --i) {
                var diam = blockSize * 2 * i / (circNum + 1);
                if (i < 2 || !isColorMode) { fill(bgClr); } else { fill(colors[separateIdx(i - 1, circNum + 1)]); }
                arc(-blockSize / 2, -blockSize / 2, diam, diam, 0, HALF_PI);
            }

            for (var i = circNum; i > 0; --i) {
                var diam = blockSize * 2 * i / (circNum + 1);
                if (i < 2 || !isColorMode) { fill(bgClr); } else { fill(colors[separateIdx(i - 1, circNum + 1)]); }
                arc(-blockSize / 2 + blockSize, -blockSize / 2 + blockSize, diam, diam, PI, PI + HALF_PI);
            }
            pop();
        }
    }
    colors = shuffleArray(colors);
}

function keyTyped() {
    switch (key.toLowerCase()) {
        case 'g': genParcattern(); break;
        case 'b': isColorMode = !isColorMode; genParcattern(); break;
        case 's': save('parcattern-' + ~~random(100, 900) + '.png'); break;
    }
}

function separateIdx(idx, length) {
    return Math.floor(Math.abs(idx - (length - 1) / 2));
}

function shuffleArray(array) {
    var j, temp;
    for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function detectBeat(level) {
    if (level > beatCutoff && level > beatThreshold) {
        genParcattern();
        beatCutoff = level * 1.2;
        framesSinceLastBeat = 0;
    } else {
        if (framesSinceLastBeat <= beatHoldFrames) {
            framesSinceLastBeat++;
        }
        else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}
