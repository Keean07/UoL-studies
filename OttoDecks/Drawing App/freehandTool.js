function FreehandTool(){
	//set an icon and a name for the object
	this.icon = "assets/freehand.jpg";
	this.name = "freehand";

	//to smoothly draw we'll draw a line from the previous mouse location
	//to the current mouse location. The following values store
	//the locations from the last frame. They are -1 to start with because
	//we haven't started drawing yet.
	var previousMouseX = -1;
	var previousMouseY = -1;
    
    this.canvasContainer = select("#content");
    this.canvasWidth = this.canvasContainer.size().width;
    this.canvasHeight = this.canvasContainer.size().height;
    
    this.stroke;

	this.draw = function(){
		//if the mouse is pressed
		if(mouseIsPressed && this.mousePressOnCanvas()){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else{
                //setting stroke
                strokeWeight(this.strokeSlider.value());
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
                console.log(this.strokeSlider.value());
			}
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		//try and comment out these lines and see what happens!
		else{
			previousMouseX = -1;
			previousMouseY = -1;
		}
	};
    
	this.unselectTool = function() {
//		updatePixels();
        loadPixels();
		//clear options
		select(".options").html("");
	};
    
	this.populateOptions = function() 
    {
        loadPixels();
        this.options = select(".options");
        this.strokeSlider = createSlider(1, 100, 1, 1);
        this.strokeSlider.parent(this.options);
        this.strokeSlider.id("strokeSlider");
        this.sliderLabel = createElement("sliderElement");
        this.sliderLabel.parent(this.options);
        this.sliderLabel.html("<label for='strokeSlider'>Stroke Weight</label>", true);
	};
    
    this.mousePressOnCanvas = function()
    {
        if ((mouseX > this.canvasContainer.elt.offsetLeft - 60 && mouseX < this.canvasContainer.elt.offsetLeft + this.canvasWidth) && 
            (mouseY > this.canvasContainer.elt.offsetTop && mouseY < this.canvasContainer.elt.offsetTop + this.canvasHeight - 40) && mouseIsPressed) 
        {
            return true;
        }
        return false;
    }
}