var video;
var threshold = 20;
var thresholdSlider;
var button;
var prevImg, currImg, diffImg;
var grid;


///////////////////////////////////////////////////////////////
function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();
    noStroke();

    thresholdSlider = createSlider(0, 255, 40);
    thresholdSlider.position(20, 20);

    // Create new grid
    grid = new Grid(640, 480);

}
///////////////////////////////////////////////////////////////
function draw() {
    background(0);
    // Draw video camera input
    image(video, 0, 0);
    // Load pixels from camera input
    video.loadPixels();

    // Create new image from current camera frame
    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

    // Resize currImg
    currImg.resize(currImg.width/4, currImg.height/4);
    // Apply Blur to currImg
    currImg.filter(BLUR, 3);
    
    // Create new image from currImg
    diffImg = createImage(video.width, video.height);

    // Resize diffImg
    diffImg.resize(diffImg.width/4, diffImg.height/4);
    
    diffImg.loadPixels();

    // Set threshold value from slider value
    threshold = thresholdSlider.value();

    // If code is already running
    if (prevImg) {
        prevImg.loadPixels();
        currImg.loadPixels();
        // Traverse currImg pixels
        for (let x = 0; x < video.width; x += 1) {
            for (let y = 0; y < video.height; y += 1) {
                let index = (x + (y * video.width)) * 4;
                // Save pixel RGB values from video
                let redSource = currImg.pixels[index + 0];
                let greenSource = currImg.pixels[index + 1];
                let blueSource = currImg.pixels[index + 2];
                
                // Save pixel RGB values from the previous frame
                let redBack = prevImg.pixels[index + 0];
                let greenBack = prevImg.pixels[index + 1];
                let blueBack = prevImg.pixels[index + 2];
                
                // Treat values are coordinates, and calculate distance between them
                let d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                // If distance is less than threshold (no movement), set as white
                if (d < threshold) {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                } else { // Else (movement), set as black
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }

    // Update and draw diffImg
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    // Create prevImg and copy current frame from video
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

    // Run grid.run() on diffImg
    grid.run(diffImg);
    // console.log(frameRate());
}
        
function keyPressed() {
    // prevImg = createImage(currImg.width, currImg.height);
    // prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
}