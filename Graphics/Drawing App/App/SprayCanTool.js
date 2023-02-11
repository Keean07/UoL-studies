//spray can object literal
function sprayCanTool() 
{    
    var self = this;
    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.jpg";
    this.points;
    this.spread;
    
    this.randomMode = false;
    
    
    //here we initialize all the colors for the raindbow color mode
    this.red = color(255, 0, 0);
    this.green = color(0, 255, 0);
    this.blue = color(0, 0, 255);
    this.yellow = color(255, 255, 0);
    this.purple = color(255, 0, 255);
    this.cyan = color(0, 255, 255);
    //and the array containing each color
    this.colors = [this.red, this.green, this.blue, this.yellow, this.purple, this.cyan];
    
    this.canvasContainer = select("#content");
    this.canvasWidth = this.canvasContainer.size().width;
    this.canvasHeight = this.canvasContainer.size().height;
    
    this.draw = function()
    {
        //initialize spread && spray
        this.spread = this.spraySize.value();
        //respective amount of points to the size of the spread
        this.points = this.spread*2.5;
        strokeWeight(1);
        
        
        //if the mouse is pressed paint on the canvas
        //spread describes how far to spread the paint from the mouse pointer
        //points holds how many pixels of paint for each mouse press.
        if (mouseIsPressed && this.mousePressOnCanvas())
        {
            //here we decide which shape to spray and determine whether to spray a base color or a rainbow color
            if (this.sprayShape.value() == "Square")
            {
                for(var i = 0; i < this.points; i++)
                {
                    push();
                    if (this.randomMode == true)
                    {
                        //choosing a random color from the colors array for each individual point
                        stroke(random(this.colors));
                    }
                    point(random(mouseX-this.spread, mouseX + this.spread), 
                        random(mouseY-this.spread, mouseY+this.spread));
                    pop();
                }
            }
            else if (this.sprayShape.value() == "Circle")
            {
                for (var i = 0; i < this.points; i++)
                {
                    push();
                    if (this.randomMode == true)
                    {
                        stroke(random(this.colors));
                    }
                    this.pX = random(mouseX + this.spread, mouseX - this.spread);
                    this.pY = random(mouseY + this.spread, mouseY - this.spread);
                    if ((dist(mouseX, mouseY, this.pX, this.pY) < (this.spread)))
                    {
                        point(this.pX, this.pY);
                    }
                }
            }
        }
    }
    
    this.unselectTool = function() 
    {
        loadPixels();
		updatePixels();
		//clear options
		select(".options").html("");
	};

	this.populateOptions = function() 
    {
        this.options = select(".options");
        
        this.spraySize = createSlider(10, 100, 1, 1);
        this.spraySize.parent(this.options);
        this.spraySize.id("spraySize");
        this.sizeLabel = createElement("sizeLabel");
        this.sizeLabel.parent(this.options);
        this.sizeLabel.html("<label for='spraySize'>Spray Size</label>", true);
        
        this.sprayShape = createSelect();
        this.sprayShape.parent(this.options);
        this.sprayShape.option("Square");
        this.sprayShape.option("Circle");
        this.sprayShape.value("Circle");
        
        
        this.randomColors = createElement("randomColors");
        this.randomColors.parent(this.options);
        this.randomColors.html("<button id='randomColors'>Rainbow Spray</button>");
        
        var randomButton = select("#randomColors");
        randomButton.mouseClicked(function() {
            //the random colors HTML and its respective actions
            if (self.randomMode == false)
            {
                self.randomMode = true;
                randomButton.html("<button id='randomColors'>Normal Spray</button>");
            }
            else if (self.randomMode == true)
            {
                self.randomMode = false;
                randomButton.html("<button id='randomColors'>Random Spray</buttons>");
            }
        });  
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
};