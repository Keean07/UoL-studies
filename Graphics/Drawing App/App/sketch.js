//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var c;

var fireIsBurning = false;

var colorBox;
var colorPicker;

var previousPixels = [];
var currentPixels = [];

var changing;

var startState = 0;

function preload() {
    DuckImg = loadImage("assets/Duck.jpg");
    VikingImg = loadImage("assets/Viking.jpg");
    TreeImg = loadImage("assets/Tree.jpg");
    ZombieImg = loadImage("assets/Zombie.jpg");
}

function setup() {

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");
    canvasWidth = canvasContainer.size().width;
    canvasHeight = canvasContainer.size().height;
    
//    //Create color picker chart
    colorBox = select(".colourPalette");
    colorPicker = createColorPicker("#ff0000");
    colorPicker.parent(colorBox);
    
//    toolbox.tools.

	//create helper functions
	helpers = new HelperFunctions();
    

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new sprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
    toolbox.addTool(new polygonTool());
    toolbox.addTool(new imagePlacerTool());
    toolbox.addTool(new eraserTool());
    toolbox.addTool(new fireBreatherTool());
	background(255);

}

function draw() 
{
    //choose stroke color from chart
	colorP = colorPicker.value();
    stroke(colorP);
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
    toolbox.tools[7].drawParticles();
}

function mousePressOnCanvas(){

if ((mouseX > canvasContainer.elt.offsetLeft - 70 && mouseX < canvasContainer.elt.offsetLeft + canvasWidth) && 
    (mouseY > canvasContainer.elt.offsetTop - 30 && mouseY < canvasContainer.elt.offsetTop + canvasHeight - 40) && mouseIsPressed) 
{
    return true;
}
return false;
}