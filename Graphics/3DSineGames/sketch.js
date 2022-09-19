var confLocs =[];
var confTheta = [];

var sizeSlider, maxHeightSlider, minHeightSlider, frameCountSlider;
var sizeLabel, maxHeightLabel, minHeightLabel, frameCountLabel;

var xLoc, zLoc;

var boxSize, gridSize;
var maxHeight, minHeight;

var frameCountMultiplier;

function setup() {
    createCanvas(900, 800, WEBGL);
    angleMode(DEGREES);

    // Set box size and grid size accordingly
    boxSize = 50;
    gridSize = boxSize * 8;

    // Initialize all sliders
    sizeSlider = createSlider(30, 150, 50, 10);
    sizeSlider.style("width", "80px");
    maxHeightSlider = createSlider(200, 600, 300, 20);
    maxHeightSlider.style("width", "80px");
    minHeightSlider = createSlider(20, 200, 100, 20);
    minHeightSlider.style("width", "80px");
    frameCountSlider = createSlider(1, 20, 1, 1);
    frameCountSlider.style("width", "80px");
    
    // Initialize all labels
    sizeLabel = createDiv("Block Size");
    sizeSlider.parent(sizeLabel);
    maxHeightLabel = createDiv("Max Height");
    maxHeightSlider.parent(maxHeightLabel);
    minHeightLabel = createDiv("Min Height");
    minHeightSlider.parent(minHeightLabel);
    frameCountLabel = createDiv("Sine Speed");
    frameCountSlider.parent(frameCountLabel);

    // Initialize all confetti locations
    for (var i = 0; i < 200; i++) {
        confLocs[i] = createVector(random(-500, 500), random(-800, 0), random(-500, 500));
        confTheta[i] = random(0, 360);
    }
}

function draw() {
    background(0);

    // Use slider values to set settings
    boxSize = sizeSlider.value();
    maxHeight = maxHeightSlider.value();
    minHeight = minHeightSlider.value();
    frameCountMultiplier = frameCountSlider.value();

    // Rotate Camera position
    xLoc = cos(frameCount/2) * height;
    zLoc = sin(frameCount/2) * height;
    camera(xLoc, -600, zLoc, 0, 0, 0, 0, 1, 0);

    // Draw Lights at each side
    pointLight(255, 0, 255, 0, -height/2, 0); // Middle Top
    pointLight(0, 255, 255, -width, -height/2, 0); // Left Top
    pointLight(0, 255, 0, width, -height/2, 0); // Right Top
    pointLight(255, 0, 0, 0, -height/2, -width); // Middle Front
    pointLight(0, 0, 255, 0, -height/2, width); // Middle Back

    // Traverse all boxes on x axis
    for (var i = -gridSize; i < gridSize; i+=boxSize) {
        push();
        translate(0,0,i);
        // Traverse all boxes on z axis
        for (var j = -gridSize; j < gridSize; j+=boxSize) {
            push();
            translate(j, 0);
            // Calculate distance from center of grid to box position
            var distance = dist(0, 0, 0, i, 0, j);
            // Map distance to a sine wave
            var length = map(sin(distance + frameCount * frameCountMultiplier), -1, 1, minHeight, maxHeight);
            noiseDetail(10);
            ambientMaterial(255);
            stroke(0);
            strokeWeight(2);
            // Draw box
            box(boxSize, length, boxSize);
            pop();
        }
        pop();
    }
    // Draw Confetti
    confetti();
    console.log(frameRate());
}

// Function that draws all confetti particles
function confetti() {
    noStroke();
    // Traverse confetti array
    for (var i = 0; i < confLocs.length; i++) {
        push();
            // Translate to confetti location
            translate(confLocs[i].x, confLocs[i].y, confLocs[i].z);
            // Add rotations
            rotateX(confTheta[i]);
            rotateY(confTheta[i]);
            rotateZ(confTheta[i]);
            // Add downward movement
            confLocs[i].y += 1;
            confTheta[i] += 10;
            specularMaterial(255);
            // Draw a plane as the confetti
            plane(15, 15, 1, 1);
        pop();
        
        // If confetti has reached bottom, redraw at top
        if (confLocs[i].y > 0) {
            confLocs[i].y = -800;
        }
    }
}