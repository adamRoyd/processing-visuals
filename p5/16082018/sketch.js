var song, fft;
// Constants
var Y_AXIS = 1;
var X_AXIS = 2;
var b1, b2, c1, c2;

// Two ArrayLists to store the vertices for two shapes
// This example assumes that each shape will have the same
// number of vertices, i.e. the size of each ArrayList will be the same
var circle = [];
var square = [];


// An ArrayList for a third set of vertices, the ones we will be drawing
// in the window
var morph = [];

// This boolean variable will control if we are morphing to a circle or square
var state = false;

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

    // Create a circle using vectors pointing from center
    for (var angle = 0; angle < 360; angle += 9) {
        // Note we are not starting from 0 in order to match the
        // path of a circle.
        var v = p5.Vector.fromAngle(radians(angle - 135));
        v.mult(100);
        circle.push(v);
        // Let's fill out morph ArrayList with blank PVectors while we are at it
        morph.push(createVector());
    }

    // A square is a bunch of vertices along straight lines
    // Top of square
    for (var x = -50; x < 50; x += 10) {
        square.push(createVector(x, -50));
    }
    // Right side
    for (var y = -50; y < 50; y += 10) {
        square.push(createVector(50, y));
    }
    // Bottom
    for (var x = 50; x > -50; x -= 10) {
        square.push(createVector(x, 50));
    }
    // Left side
    for (var y = 50; y > -50; y -= 10) {
        square.push(createVector(-50, y));
    }

}

function draw() {

    var spectrum = fft.analyze();
    var rms = analyzer.getLevel();

    // Define colors
    c1 = color(10 + rms * 1000, 102, 0);
    c2 = color(0, 100 + rms * 5000, 100 + rms * 5000);
    c3 = color(150 + rms * 100, 100 + rms * 5000, 100 + rms * 5000);
    // Background
    // setGradient(0, 0, width / 2, height, b1, b2, X_AXIS);
    // setGradient(width / 2, 0, width / 2, height, b2, b1, X_AXIS);
    // Foreground
    setGradient(0, 0, width / 2, height, c1, c3, X_AXIS);
    setGradient(width / 2, 0, width / 2, height, c2, c1, X_AXIS);

    // We will keep how far the vertices are from their target
    var totalDistance = 0;

    // Look at each vertex
    for (var i = 0; i < circle.length; i++) {
        var v1;
        // Are we lerping to the circle or square?
        if (state) {
            v1 = circle[i];
        } else {
            v1 = square[i];
        }
        // Get the vertex we will draw
        var v2 = morph[i];
        // Lerp to the target
        v2.lerp(v1, 0.1);
        // Check how far we are from target
        totalDistance += p5.Vector.dist(v1, v2);
    }

    // If all the vertices are close, switch shape
    if (totalDistance < 0.1) {
        state = !state;
    }

    // Draw relative to center
    translate(width / 2, height / 2);
    strokeWeight(4);
    // Draw a polygon that makes up all the vertices
    beginShape();
    noFill();
    stroke(255);

    morph.forEach(v => {
        vertex(v.x, v.y);
    });
    endShape(CLOSE);
}


function setGradient(x, y, w, h, c1, c2, axis) {

    noFill();

    if (axis == Y_AXIS) {  // Top to bottom gradient
        for (var i = y; i <= y + h; i++) {
            var inter = map(i, y, y + h, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    }
    else if (axis == X_AXIS) {  // Left to right gradient
        for (var i = x; i <= x + w; i++) {
            var inter = map(i, x, x + w, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }
}