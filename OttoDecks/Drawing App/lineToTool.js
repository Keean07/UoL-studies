function LineToTool(){
    //Set an icon and name for the object
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";
    //Here we declare and initialize the starting values for the line drawer and declare that we are not yet drawing.
    var self = this;
	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;
    this.strokeSize;
    
    this.canvasContainer = select("#content");
    this.canvasWidth = this.canvasContainer.size().width;
    this.canvasHeight = this.canvasContainer.size().height;
    
    //Here, we create the method that does the drawing
	this.draw = function()
    {
        this.strokeSize = this.strokeSlider.value();
		if (mouseIsPressed && this.mousePressOnCanvas())
        {
            push();
            strokeWeight(this.strokeSize);
            //initial if statement determines when we begin using the drawing tool
			if (startMouseX == -1)
            {   //this if statement determines whether we are starting a new drawing
				startMouseX = mouseX;   //The two intial values get saved over by the new X and Y values, determining where the drawing will start
				startMouseY = mouseY;
				drawing = true;         //Here we mark that drawing has officially begun
				loadPixels();           //here the pixels are being loaded from the pixel array - containing all the pixels of the display to prepare for modification
			}
            else {
				updatePixels();         //Here we declare the updatePixels function to declare that we are to modify and save the image modification
				line(startMouseX, startMouseY, mouseX, mouseY);            //Here we state the modification to the image
			}
            pop();
		}

		else if (drawing)
        {               //Here we declare that if the mouse is not pressed(the function not being used) then values return to initial values
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};

    
    this.mousePressOnCanvas = function()
    {
        if ((mouseX > this.canvasContainer.elt.offsetLeft - 60 && mouseX < this.canvasContainer.elt.offsetLeft + this.canvasWidth) && 
            (mouseY > this.canvasContainer.elt.offsetTop && mouseY < this.canvasContainer.elt.offsetTop + this.canvasHeight - 40) && mouseIsPressed) 
        {
            return true;
        }
        return false;
    };
    
    this.populateOptions = function()
    {
        //adding stroke slider
        loadPixels();
        this.options = select(".options");
        this.strokeSlider = createSlider(1, 80, 1, 1);
        this.strokeSlider.parent(this.options);
        this.strokeSlider.id("strokeSlider");
        this.sliderLabel = createElement("sliderElement");
        this.sliderLabel.parent(this.options);
        this.sliderLabel.html("<label for='strokeSlider'>Stroke Weight</label>", true);
    };
    
    this.unselectTool = function() {
        loadPixels();
		updatePixels();
		//clear options
		select(".options").html("");
	};
}
