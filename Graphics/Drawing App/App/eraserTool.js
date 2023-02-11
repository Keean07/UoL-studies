function eraserTool() //switching back to other tools doesnt work
{
    this.icon = "assets/eraserTool.jpg";
    this.name = "eraserTool";
    
    var self = this;
    this.erasing = false;
    
    this.canvasContainer = select("#content");
    this.canvasWidth = this.canvasContainer.size().width;
    this.canvasHeight = this.canvasContainer.size().height;
    
    this.draw = function() 
    {    
        updatePixels();
        this.eraserSize = this.eraserSizeSlider.value();
        if (this.erasing == false)
        {
            //draw aim circle
            push();
            noFill();
            stroke(0, 0, 0);
            ellipse(mouseX, mouseY, this.eraserSize);
            pop();
        }
        if (this.mousePressOnCanvas && mouseIsPressed)
        {
            //draw white to canvas
            updatePixels();
            this.erasing = true;
            fill(255);
            noStroke();
            ellipse(mouseX, mouseY, this.eraserSize);
            loadPixels();
        }
        if (this.erasing == true && !mouseIsPressed)
        {
            loadPixels();
            this.erasing = false;
        }
    }
    
    this.mousePressOnCanvas = function(){

    if ((mouseX > this.canvasContainer.elt.offsetLeft - 70 && mouseX < this.canvasContainer.elt.offsetLeft + this.canvasWidth) && 
        (mouseY > this.canvasContainer.elt.offsetTop && mouseY < this.canvasContainer.elt.offsetTop + this.canvasHeight - 40) && mouseIsPressed) 
    {
        return true;
    }
    return false;
    }        
    
	this.unselectTool = function() 
    {
//		updatePixels();
		//clear options
		select(".options").html("");
	};
    
    this.populateOptions = function() 
    {
        this.options = select(".options");
        this.eraserSizeSlider = createSlider(10, 50, 10, 0);
        this.eraserSizeSlider.parent(this.options);
        this.eraserSizeSlider.id("eraserSlider");
        this.eraserLabel = createElement("eraserLabel");
        this.eraserLabel.parent(this.options);
        this.eraserLabel.html("<label for='eraserSlider'>Eraser Size</label>", true);
    }
}