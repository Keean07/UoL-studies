// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var sepia, darken, blurred, border, invert, grayscale, edgeDetect, sharpen;

// Vertical Edges
var matrixX = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1]
];

// Horizontal Edges
var matrixY = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1]
]

// Sharpness Matrix
var SharpnessMatrix = [
  [-1, -1, -1],
  [-1,  9, -1],
  [-1, -1, -1]
];

var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
  createCanvas((imgIn.width * 2), imgIn.height + 100);
  pixelDensity(1);
  
  // Default filters
  sepia = true;
  darken = true;
  blurred = true;
  border = true;

  // Custom filters
  invert = false;
  grayscale = false;
  edgeDetect = false;
  sharpen = false;
}
/////////////////////////////////////////////////////////////////
function draw() {
  background(0);
  // Draw left image
  image(imgIn, 0, 0);
  // Draw filtered image
  image(earlyBirdFilter(imgIn), imgIn.width, 0);
  push();
  textAlign(CENTER);
  textSize(20);
  fill(255, 0, 0);
  // Draw text description at bottom of canvas
  text("Click on left image to direct the blur function. Be patient with loading times.", width/2, height - 70);
  text("Default Toggles - 1: Sepia, 2: Darken, 3: Blur, 4: Border.", width/2, height - 45);
  text("Custome Toggles - 5: Invert, 6: Grayscale, 7: Edge Detection, 8: Sharpen", width/2, height - 20);
  pop();
  noLoop();
}
/////////////////////////////////////////////////////////////////
// When mouse is pressed, loop over draw
function mousePressed(){
  loop();
}

// Initialize numbers 1-8 for all filters
function keyPressed() {
  if (keyCode == 49 && !sepia) {
    sepia = true;
  } else if (keyCode == 49 && sepia) {
    sepia = false;
  } else if (keyCode == 50 && !darken) {
    darken = true;
  } else if (keyCode == 50 && darken) {
    darken = false;
  } else if (keyCode == 51 && !blurred) {
    blurred = true;
  } else if (keyCode == 51 && blurred) {
    blurred = false;
  } else if (keyCode == 52 && !border) {
    border = true;
  } else if (keyCode == 52 && border) {
    border = false;
  } else if (keyCode == 53 && !invert) {
    invert = true;
  } else if (keyCode == 53 && invert) {
    invert = false;
  } else if (keyCode == 54 && !grayscale) {
    grayscale = true;
  } else if (keyCode == 54 && grayscale) {
    grayscale = false;
  } else if (keyCode == 55 && !edgeDetect) {
    edgeDetect = true;
  } else if (keyCode == 55 && edgeDetect) {
    edgeDetect = false;
  } else if (keyCode == 56 && !sharpen) {
    sharpen = true;
  } else if (keyCode == 56 && sharpen) {
    sharpen = false;
  } 
  
  loop();
}
/////////////////////////////////////////////////////////////////
// Function that checks which filters should be applied, then applies them
function earlyBirdFilter(img){
  var resultImg = createImage(img.width, img.height);
  resultImg = img; // Added this to allow sepia filter to be removed without breaking code
  if (sepia) {
    resultImg = sepiaFilter(resultImg); // Changed this to resultImg to prevent code breaking when removing sepia filter
  }
  if (darken) {
    resultImg = darkCorners(resultImg);
  }
  if (blurred) {
    resultImg = radialBlurFilter(resultImg);
  }
  if (border) {
    resultImg = borderFilter(resultImg);
  }
  if (invert) {
    resultImg = invertFilter(resultImg);
  }
  if (grayscale) {
    resultImg = grayScaleFilter(resultImg);
  }
  if (edgeDetect) {
    resultImg = edgeDetectFilter(resultImg);
  }
  if (sharpen) {
    resultImg = sharpFilter(resultImg);
  }
  return resultImg;
}

/*
  The below filters all have the same structure, thus I will only explain the first
*/

// Function that applies Sepia Filter
function sepiaFilter(img) {
  img.loadPixels();
  var imgOut = createImage(img.width, img.height);
  imgOut.loadPixels();

  // Loop over pixels in X axis
  for (var x = 0; x < img.width; x++) {
    // Loop over pixels in Y axis
      for (var y = 0; y < img.height; y++) {
          // Get relevant pixel RGB values
          var index = ((img.width * y) + x) * 4;
          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];
          
          // Calculate new RGB values
          var newRed = (r * 0.393) + (g * 0.769) + (b * 0.189);
          var newGreen = (r * 0.349) + (g * 0.686) + (b * 0.168);
          var newBlue = (r * 0.272) + (g * 0.534) + (b * 0.131);

          // Set new RGB values
          imgOut.pixels[index + 0] = newRed;
          imgOut.pixels[index + 1] = newGreen;
          imgOut.pixels[index + 2] = newBlue;
          imgOut.pixels[index + 3] = 255;
      }
  }

  // Update pixels and return filtered image
  imgOut.updatePixels();
  return imgOut;
}

// Function that applies darkCorners filter
function darkCorners(img) {
  var imgOut = createImage(img.width, img.height);
  imgOut.loadPixels();
  img.loadPixels();

  // Calculate Image Center
  var imageO = [img.width/2, img.height/2];

  for (var x = 0; x < img.width; x++) {
      for (var y = 0; y < img.height; y++) {
          var index = ((img.width * y) + x) * 4;
          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];

          var newRed, newGreen, newBlue, dynLum;

          // Calculate distance of pixel from image center
          var pixelDist = dist(x, y, imageO[0], imageO[1]);
          var maxDist = dist(0, 0, imageO[0], imageO[1]);

          // Determine what degree of darkening to apply
          if (pixelDist < 300) {
            dynLum = 1;
          } else if (pixelDist >= 300 && pixelDist < 450) {
            dynLum = constrain(map(pixelDist, 300, 450, 1, 0.4), 0, 255);
          } else if (pixelDist >= 450) {
            dynLum = map(pixelDist, 450, maxDist, 0.4, 0);
          }

          // Apply darkening amounts
          newRed = r*dynLum;
          newGreen = g*dynLum;
          newBlue = b*dynLum;

          // Constrain RGB values
          newRed = constrain(newRed, 0, 255);
          newGreen = constrain(newGreen, 0, 255);
          newBlue = constrain(newBlue, 0, 255);

          // Set new RGB values
          imgOut.pixels[index + 0] = newRed;
          imgOut.pixels[index + 1] = newGreen;
          imgOut.pixels[index + 2] = newBlue;
          imgOut.pixels[index + 3] = 255;
      }
  }

  imgOut.updatePixels();
  return imgOut;
}

function radialBlurFilter(img) {
  var imgOut = createImage(img.width, img.height);
  var matrixSize = matrix.length;

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
      for (var y = 0; y < img.height; y++) {
          var index = ((img.width * y) + x) * 4;
          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];

          // Get Convolution RGB values
          var c = convolution(x, y, matrix, matrixSize, img);

          // Calculate pixel distance from mouse coordinates
          var pixelDist = dist(mouseX, mouseY, x, y);
          // Map that distance from 0-1
          var mappedVal = map(pixelDist, 100, 300, 0, 1);
          // Constrain value to 0-1
          var dynBlur = constrain(mappedVal, 0, 1);

          // Apply blur amounts
          imgOut.pixels[index + 0] = (c[0] * dynBlur) + (r * (1-dynBlur));
          imgOut.pixels[index + 1] = (c[1] * dynBlur) + (g * (1-dynBlur));
          imgOut.pixels[index + 2] = (c[2] * dynBlur) + (b * (1-dynBlur));
          imgOut.pixels[index + 3] = 255;
      }
  }

  imgOut.updatePixels();
  return imgOut;
}

// Convolution matrix from class demonstration
function convolution(x, y, matrix, matrixSize, img) {
  var totalRed = 0;
  var totalGreen = 0;
  var totalBlue = 0;

  var offset = floor(matrixSize/2);

  for (var i = 0; i < matrixSize; i++) {
      for (var j = 0; j < matrixSize; j++) {
          var xLoc = x + i - offset;
          var yLoc = y + j - offset;  

          var index = (img.width * yLoc + xLoc) * 4;

          index = constrain(index, 0, img.pixels.length - 1);

          totalRed += img.pixels[index + 0] * matrix[i][j];
          totalGreen += img.pixels[index + 1] * matrix[i][j];
          totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
  }
  return [totalRed, totalGreen, totalBlue];
}

// Function that applies the borderFilter
function borderFilter(img) {
  // Create border buffer
  var buffer = createGraphics(img.width, img.height);
  push();
  buffer.strokeWeight(30);
  buffer.stroke(255);
  buffer.noFill();
  buffer.image(img, 0, 0);
  // Draw two border rectangles
  buffer.rect(0, 0, img.width, img.height, 50);
  buffer.rect(0, 0, img.width, img.height);
  pop();

  // Return the bordered image
  return buffer;
}

// Function that applies the Invert Filter
function invertFilter(img) {
  img.loadPixels();
  var imgOut = createImage(img.width, img.height);
  imgOut.loadPixels();

  for (var x = 0; x < img.width; x++) {
      for (var y = 0; y < img.height; y++) {
          var index = ((img.width * y) + x) * 4;
          // Calculate the inverse of each color value
          var r = 255 - img.pixels[index + 0];
          var g = 255 - img.pixels[index + 1];
          var b = 255 - img.pixels[index + 2];

          imgOut.pixels[index + 0] = r;
          imgOut.pixels[index + 1] = g;
          imgOut.pixels[index + 2] = b;
          imgOut.pixels[index + 3] = 255;
      }
  }

  imgOut.updatePixels();
  return imgOut;
}

// Function that applies the grayScaleFilter
function grayScaleFilter(img) {
  var imgOut = createImage(img.width, img.height);

  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
      for (var y = 0; y < img.height; y++) {
          var index = ((img.width * y) + x) * 4;
          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];

          // Grayscale with Weighted average/Luma calculation 
          var gray = r * 0.299 + g * 0.587 + b * 0.0114; 

          imgOut.pixels[index + 0] = gray;
          imgOut.pixels[index + 1] = gray;
          imgOut.pixels[index + 2] = gray;
          imgOut.pixels[index + 3] = 255;
      }
  }

  imgOut.updatePixels();
  return imgOut;
}

// Function that applies the edgeDetectFilter
function edgeDetectFilter(img){
  var imgOut = createImage(img.width, img.height);
  var matrixSize = matrixX.length;

  imgOut.loadPixels();
  img.loadPixels();

  // read every pixel
  for (var x = 0; x < imgOut.width; x++) {
      for (var y = 0; y < imgOut.height; y++) {
          var index = (x + y * imgOut.width) * 4;
          var maxVal = (1+2+1) * 255; // Greatest convolution value = 1020
          
          // Detect Vertical lines
          var cX = convolution(x, y, matrixX, matrixSize, img);
          cX = map(abs(cX[0]), 0, maxVal, 0, 255);
          
          // Detect Horizontal lines
          var cY = convolution(x, y, matrixY, matrixSize, img);
          cY = map(abs(cY[0]), 0, maxVal, 0, 255);

          // Combine Vertical and Horizontal lines
          var combo = cX + cY;

          imgOut.pixels[index + 0] = combo;
          imgOut.pixels[index + 1] = combo;
          imgOut.pixels[index + 2] = combo;
          imgOut.pixels[index + 3] = 255;
      }
  }
  imgOut.updatePixels();
  return imgOut;
}

// Function that applies the sharpFilter
function sharpFilter(img){
  img.loadPixels();
  var imgOut = createImage(img.width, img.height);
  var matrixSize = SharpnessMatrix.length;
  imgOut.loadPixels();

  for (var x = 0; x < img.width; x++) {
      for (var y = 0; y < img.height; y++) {

          var index = (x + y * img.width) * 4;

          // Apply sharpness matrix to pixel
          var c = convolution(x, y, SharpnessMatrix, matrixSize, img);

          imgOut.pixels[index + 0] = c[0];
          imgOut.pixels[index + 1] = c[1];
          imgOut.pixels[index + 2] = c[2];
          imgOut.pixels[index + 3] = 255;
      }
  }
  imgOut.updatePixels();
  return imgOut;
}