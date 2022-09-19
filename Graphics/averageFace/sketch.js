var imgs = [];
var avgImg;
var numOfImages = 30;
var currentImage;

//////////////////////////////////////////////////////////
function preload() {
    // Initialize strings to build image names
    var path = "assets/";
    var type = ".jpg";
    // For loop that loads each image
    for (var i = 0; i < numOfImages; i++) {
        var filename = path+i+type;
        console.log(filename);
        imgs[i] = loadImage(filename);
    }
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgs[0].width*2, imgs[0].height);
    pixelDensity(1);
    avgImg = createGraphics(imgs[0].width, imgs[0].height);
    // Choose a random first image
    currentImage = int(random(0, 29));
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    
    // For loop to call loadPixels() on each image
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].loadPixels();
    }

    for (var y = 0; y < imgs[0].height; y++) {
        for (var x = 0; x < imgs[0].width; x++) {
            pixelIndex = (imgs[0].width * y + x) * 4;

            // Initialize average color values
            var sumR = 0;
            var sumG = 0;
            var sumB = 0;
            
            // Add each R,G, and B value of this pixel from each image to the average color values
            for (var k = 0; k < imgs.length; k++) {
                sumR += imgs[k].pixels[pixelIndex];
                sumG += imgs[k].pixels[pixelIndex + 1];
                sumB += imgs[k].pixels[pixelIndex + 2];
            }

            // Set the relevant pixel on the right to the average value by taking the sum and dividing it by the amout of images
            avgImg.set(x,y, color(sumR/imgs.length, sumG/imgs.length, sumB/imgs.length));

            // Map the mouse value against the width of the canvas to a value between 0 and 1.
            var mouseVal = map(mouseX, 0, width, 0, 1);
            
            // Get the color values of the current image
            var originalCol = color(
                imgs[currentImage].pixels[pixelIndex], 
                imgs[currentImage].pixels[pixelIndex + 1], 
                imgs[currentImage].pixels[pixelIndex + 2], 
                255);

            // Get the color values of the average image
            var averageCol = color(
                avgImg.pixels[pixelIndex],
                avgImg.pixels[pixelIndex + 1],
                avgImg.pixels[pixelIndex + 2],
                255
            );

            // Lerp the two above colors by using the mapped mouse value
            var newCol = lerpColor(originalCol, averageCol, mouseVal);

            // Set the relevant pixels on the average image to the lerped color
            avgImg.set(x,y, newCol);
        }
    }

    avgImg.updatePixels();

    // Display left image
    image(imgs[currentImage], 0, 0, imgs[currentImage].width, imgs[currentImage].height);
    // Display right image
    image(avgImg, width/2, 0, imgs[currentImage].width, imgs[currentImage].height);

    noLoop();
}

function keyPressed() {
    currentImage = int(random(0, 30));
    loop();
}   

function mouseMoved() {
    loop();
}