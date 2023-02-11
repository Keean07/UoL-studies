/* I have achieved the drawing function for custom shapes, now I need to implement functionality for select shapes to be drawn.
*/


function polygonTool()
{    
    var self = this;
    this.name = "polygonTool";
    this.icon = "assets/Polygon.jpg";
    
    this.canvasContainer = select("#content");
    this.canvasWidth = this.canvasContainer.size().width;
    this.canvasHeight = this.canvasContainer.size().height;
    
    this.editMode = false;
    this.currentShape = [];
    noFill();
    
    this.selectedShape;
    this.startX = -1;
    this.startY = -1;
    this.endX = mouseX;
    this.endY = mouseY;
    
    this.editStroke = color(255, 0, 0, 100);
    this.strokeSize;
    
    
    this.drawing = false;
    
    this.draw = function()
    {
        updatePixels();
        this.strokeSize = this.strokeSlider.value();
        this.selectedShape = this.selector.value();
        if (!this.editMode)
        {
            //determining which shape to draw and calling its function
            push();
            strokeWeight(this.strokeSize);
            if (this.selectedShape == "No Shape")
            {
                this.drawNoShape();
            }
            else if (this.selectedShape == "Rectangle")
            {
                this.drawRectangle();
            }
            else if (this.selectedShape == "Square")
            {
                this.drawSquare();
            }
            else if (this.selectedShape == "Circle")
            {
                this.drawCircle();
            }
            else if (this.selectedShape == "Madness")
            {
                this.drawMadness();
            }
            else if (this.selectedShape == "Triangle")
            {
                this.drawTriangle();
            }
            pop();
        }
        else if (this.editMode)
        {
            //determining which shape must be editted and calling that specific editShape function
            push();
            stroke(this.editStroke);
            strokeWeight(1);
            line(mouseX, mouseY - 250, mouseX, mouseY + 250);
            line(mouseX - 250, mouseY, mouseX + 250, mouseY);
            ellipse(mouseX, mouseY, 50);
            ellipse(mouseX, mouseY, 250)
            pop();
            if (this.selectedShape == "No Shape")
            {
                this.editNoShape();
            }
            else if (this.selectedShape == "Rectangle")
            {
                this.editRectangle();
            }
            else if (this.selectedShape == "Square")
            {
                this.editSquare();
            }
            else if (this.selectedShape == "Circle")
            {
                this.editCircle();
            }
            else if (this.selectedShape == "Madness")
            {
                this.editMadness();
            }
            else if (this.selectedShape == "Triangle")
            {
                this.editTriangle();
            }
        }
        
        //code to draw the vertices as the shape is drawn
        beginShape();
        for (i = 0; i < this.currentShape.length; i++)
        {
            push();
            strokeWeight(this.strokeSize);
            if (this.selectedShape == "Circle")
            {
                curveVertex(this.currentShape[i].x, this.currentShape[i].y);
            }
            else 
            {
                vertex(this.currentShape[i].x, this.currentShape[i].y);
            }
            if (this.editMode)
            {
                push();
                fill(this.editStroke);
                ellipse(this.currentShape[i].x, this.currentShape[i].y, 5);
                noFill();
                pop();
                
            }
        }
        endShape();
        
    }
    //these are individual blueprint to draw and edit the shapes
    
    this.drawRectangle = function() 
    {
        if (this.mousePressOnCanvas() && this.drawing == false)
        {
            if (!(this.currentShape == [])) 
            {
                this.currentShape = [];
                this.drawing = true;
                this.startX = mouseX;
                this.startY = mouseY;
                
            }
        }
        if (this.drawing == true)
        {
            push();
            noFill();
            strokeWeight(this.strokeSize);
//            stroke(0, 0, 0);
            rect(this.startX, this.startY, mouseX - this.startX, mouseY - this.startY);

            if (this.drawing == true && !mouseIsPressed)
            {
                this.currentShape.push({
                    x: this.startX,
                    y: this.startY
                }, {
                    x: mouseX,
                    y: this.startY
                }, {
                    x: mouseX,
                    y: mouseY
                }, {
                    x: this.startX,
                    y: mouseY
                }, {
                    x: this.startX,
                    y: this.startY
                });
                this.drawing = false;
            }
            pop();
        }
    }
    
    this.drawNoShape = function()
    {
        push();
        strokeWeight(this.strokeSize);
        if (this.mousePressOnCanvas() && this.drawing == false)
        this.currentShape.push({
            x : mouseX,
            y : mouseY
        });
        pop();
    }
    
    this.drawSquare = function()
    {
        if (this.mousePressOnCanvas() && this.drawing == false)
        {
            if (!(this.currentShape == [])) 
            {
                this.currentShape = [];
                this.drawing = true;
                this.startX = mouseX;
                this.startY = mouseY;
            }
        }
        if (this.drawing == true)
        {
            push();
            noFill();
            strokeWeight(this.strokeSize);
//            stroke(0, 0, 0);
            rect(this.startX, this.startY, (dist(this.startX, this.startY, mouseX, mouseY)), (dist(this.startX, this.startY, mouseX, mouseY)));

            if (this.drawing == true && !mouseIsPressed)
            {
                this.currentShape.push({
                    x: this.startX,
                    y: this.startY
                }, {
                    x: this.startX + (dist(this.startX, this.startY, mouseX, mouseY)),
                    y: this.startY
                }, {
                    x: this.startX + (dist(this.startX, this.startY, mouseX, mouseY)),
                    y: this.startY + (dist(this.startX, this.startY, mouseX, mouseY))
                }, {
                    x: this.startX,
                    y: this.startY + (dist(this.startX, this.startY, mouseX, mouseY))
                }, {
                    x: this.startX,
                    y: this.startY
                });
                this.drawing = false;
            }
            pop();
        }
    }
    
    this.drawCircle = function()
    {
        if (this.mousePressOnCanvas() && this.drawing == false)
        {
            if (!(this.currentShape == []))
            {
                this.currentShape = [];
                this.drawing = true;
                this.startX = mouseX;
                this.startY = mouseY;
            }
        }
        if (this.drawing == true)
        {
            push();
            strokeWeight(this.strokeSize);
            angleMode(DEGREES);
            beginShape();
            for (var a = 0; a < 361; a += 10)
            {
                var x = (mouseX - this.startX) * sin(a) + this.startX;
                var y = (mouseY - this.startY) * cos(a) + this.startY;
                curveVertex(x, y);
            }
            endShape();
            
            if (this.drawing == true && !mouseIsPressed)
            {
                for (var a = 0; a < 361; a += 10)
                {
                    this.currentShape.push({
                        x: (mouseX - this.startX) * sin(a) + this.startX,
                        y: (mouseY - this.startY) * cos(a) + this.startY
                    });
                    this.drawing = false;
                }
            }
            pop();
        }
    }
    
    this.drawMadness = function()
    {
        if (this.mousePressOnCanvas() && this.drawing == false)
        {
            if (!(this.currentShape == []))
            {
                this.currentShape = [];
                this.drawing = true;
                this.startX = mouseX;
                this.startY = mouseY;
            }
        }
        if (this.drawing == true)
        {
            push();
            strokeWeight(this.strokeSize);
            angleMode(RADIANS);
            beginShape();
            for (var a = 0; a < 361; a += 10)
            {
                var x = (mouseX - this.startX) * sin(a) + this.startX;
                var y = (mouseY - this.startY) * cos(a) + this.startY;
                vertex(x, y);
            }
            endShape();
            
            if (this.drawing == true && !mouseIsPressed)
            {
                for (var a = 0; a < 361; a += 10)
                {
                    this.currentShape.push({
                        x: (mouseX - this.startX) * sin(a) + this.startX,
                        y: (mouseY - this.startY) * cos(a) + this.startY
                    });
                    this.drawing = false;
                }
            }
            pop();
        }
    }
    this.drawTriangle = function()
    {
        if (this.mousePressOnCanvas() && this.drawing == false)
        {
            if (!(this.currentShape == [])) 
            {
                this.currentShape = [];
                this.drawing = true;
                this.startX = mouseX;
                this.startY = mouseY;
            }
        }
        if (this.drawing == true)
        {
            push();
            noFill();
            strokeWeight(this.strokeSize);
//            stroke(0, 0, 0);
            triangle(this.startX, this.startY, mouseX, mouseY, (mouseX - this.startX) * 2 + this.startX, this.startY);

            if (this.drawing == true && !mouseIsPressed)
            {
                this.currentShape.push({
                    x: this.startX,
                    y: this.startY
                }, {
                    x: mouseX,
                    y: mouseY
                }, {
                    x: (mouseX - this.startX) * 2 + this.startX,
                    y: this.startY
                }, {
                    x: this.startX,
                    y: this.startY
                });
                this.drawing = false;
            }
            pop();
        }        
    }
    this.editNoShape = function()
    {
        for (var i = 0; i < this.currentShape.length; i++)
        {
            if (dist(mouseX, mouseY, this.currentShape[i].x, this.currentShape[i].y) < 15 && mouseIsPressed)
            {
                this.currentShape[i].x = mouseX;
                this.currentShape[i].y = mouseY;
            }
        }
    }
    this.editRectangle = function()
    {
        for (var i = 0; i < this.currentShape.length; i++)
        {
            if (dist(mouseX, mouseY, this.currentShape[i].x, this.currentShape[i].y) < 15 && mouseIsPressed)
            {
                this.currentShape[i].x = mouseX;
                this.currentShape[i].y = mouseY;
            }
        }       
    }
    this.editSquare = function()
    {
        for (var i = 0; i < this.currentShape.length; i++)
        {
            if (dist(mouseX, mouseY, this.currentShape[i].x, this.currentShape[i].y) < 15 && mouseIsPressed)
            {
                this.currentShape[i].x = mouseX;
                this.currentShape[i].y = mouseY;
            }
        }               
    }
    this.editCircle = function()
    {
        for (var i = 0; i < this.currentShape.length; i++)
        {
            if (dist(mouseX, mouseY, this.currentShape[i].x, this.currentShape[i].y) < 15 && mouseIsPressed)
            {
                this.currentShape[i].x = mouseX;
                this.currentShape[i].y = mouseY;
            }
        }  
    }
    this.editMadness = function()
    {
        for (var i = 0; i < this.currentShape.length; i++)
        {
            if (dist(mouseX, mouseY, this.currentShape[i].x, this.currentShape[i].y) < 15 && mouseIsPressed)
            {
                this.currentShape[i].x = mouseX;
                this.currentShape[i].y = mouseY;
            }
        }  
    }
    this.editTriangle = function()
    {
        for (var i = 0; i < this.currentShape.length; i++)
        {
            if (dist(mouseX, mouseY, this.currentShape[i].x, this.currentShape[i].y) < 15 && mouseIsPressed)
            {
                this.currentShape[i].x = mouseX;
                this.currentShape[i].y = mouseY;
            }
        }
    }
    this.mousePressOnCanvas = function(){

    if ((mouseX > this.canvasContainer.elt.offsetLeft - 70 && mouseX < this.canvasContainer.elt.offsetLeft + this.canvasWidth) && 
        (mouseY > this.canvasContainer.elt.offsetTop - 30 && mouseY < this.canvasContainer.elt.offsetTop + this.canvasHeight - 40) && mouseIsPressed) 
    {
        return true;
    }
    return false;
    }
    
	this.populateOptions = function() 
    {
        //I've added a shape selector, edit shape button and complete shape button and added their respective actions
        loadPixels();
        this.options = select(".options");
        this.strokeSlider = createSlider(1, 60, 1, 1);
        this.strokeSlider.parent(this.options);
        this.strokeSlider.id("strokeSlider");
        this.sliderLabel = createElement("sliderElement");
        this.sliderLabel.parent(this.options);
        this.sliderLabel.html("<label for='strokeSlider'>Stroke Weight</label>", true);
        
        this.options = select(".options");
        this.editButton = createElement("editButton");
        this.editButton.parent(this.options);
        this.editButton.html("<button id='editButton'>Edit Shape</button>")

        //click handle
        button1 = select("#editButton");
        button1.mouseClicked(function() {
            if (!self.editMode) {
                button1.html("<button id='editButton'>Add Vertices</button>");
                self.editMode = true;
            }
            else if (self.editMode)
            {
                button1.html("<button id='editButton'>Edit Shape</button>");
                self.editMode = false;
            }
        });

        this.completeButton = createElement("completeButton");
        this.completeButton.parent(this.options);
        this.completeButton.html("<button id='completeButton'>Complete Shape</button>");

        button2 = select("#completeButton");
        button2.mouseClicked(function() {
            self.editMode = false;
            button1.html("<button id='editButton'>Edit Shape</button>")

            self.editMode = false;
            draw();
            loadPixels();
            self.currentShape = [];
        });

        this.selector = createSelect();
        this.selector.parent(this.options);
        this.selector.option("No Shape");
        this.selector.option("Square");
        this.selector.option("Rectangle");
        this.selector.option("Circle");
        this.selector.option("Triangle");
        this.selector.option("Madness");
        this.selector.value("No Shape");
        
        
	};
    
	this.unselectTool = function() {
        loadPixels();
		updatePixels();
		//clear options
		select(".options").html("");
	};

}