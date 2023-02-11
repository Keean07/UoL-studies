
// moving and size changing works, must still just interate rotations + fix resting ellipses

//dont mess this up

function imagePlacerTool() {
    
    var self = this;
    this.name = "imagePlacerTool";
    this.icon = "assets/imagePlacer.jpg";
    
    this.canvasContainer = select("#content");
    this.canvasWidth = this.canvasContainer.size().width;
    this.canvasHeight = this.canvasContainer.size().height;
    
    this.startX = -1;
    this.startY = -1;
    this.placing;
    this.selectedImage;
    this.currentImage = [];
    this.edittingImage = [];
    this.editMode;
    this.editX;
    this.editY;
    this.rotateMode;
    this.translationX;
    this.translationY;
    
    this.movingImage = false;
    this.drawCircles;
    
    this.draw = function()
    {
        this.sliderValue = this.slider.value();
        //declaring which image is to be placed
        if (this.selector.value() == "Duck")
        {
            this.selectedImage = DuckImg;
            this.placeImage();
        }
        else if (this.selector.value() == "Tree")
        {
            this.selectedImage = TreeImg;
            this.placeImage();
        }
        else if (this.selector.value() == "Zombie")
        {
            this.selectedImage = ZombieImg;
            this.placeImage();
        }
        else if (this.selector.value() == "Viking")
        {
            this.selectedImage = VikingImg;
            this.placeImage();
        }
    }

    this.editImage = function()
    {
        push();
        
        noFill();
        stroke(255, 0, 0);
        translate(this.translationX, this.translationY);
        angleMode(DEGREES);
        rotate(this.slider2.value());
        
        this.mX = mouseX - this.translationX;
        this.mY = mouseY - this.translationY;
        
        
        if (this.drawCircles == true)
        {
            ellipse(this.edittingImage[0].x + this.edittingImage[0].width, this.edittingImage[0].y + this.edittingImage[0].height, 5);  //edit circle
            ellipse(this.edittingImage[0].x + this.edittingImage[0].width/2, this.edittingImage[0].y - 20, 5); //move circle
            
        }
        push();
        rotate(-(this.slider.value()));
        fill(255, 0, 0);
        ellipse(this.mX, this.mY, 10);
        fill(0, 255,0);
        ellipse(mouseX, mouseY, 10);
        pop();
        
        //edit image size
        
        if (dist(this.mX, this.mY, this.edittingImage[0].x + this.edittingImage[0].width, this.edittingImage[0].y + this.edittingImage[0].height) < 20)
        {
            cursor(CROSS);
            if (mouseIsPressed)
            {
                rect(this.edittingImage[0].x, this.edittingImage[0].y, this.edittingImage[0].width, this.edittingImage[0].height);
                this.edittingImage[0].width = this.mX - this.edittingImage[0].x;
                this.edittingImage[0].height = this.mY - this.edittingImage[0].y;
            }
        }
        
        //edit image location
        
        if (dist(this.mX, this.mY, this.edittingImage[0].x + this.edittingImage[0].width/2, this.edittingImage[0].y - 20) < 20)
        {
            cursor(CROSS);
            if (mouseIsPressed)
            {
                rect(this.edittingImage[0].x, this.edittingImage[0].y, this.edittingImage[0].width, this.edittingImage[0].height);
                
                this.edittingImage[0].x = (this.mX - this.edittingImage[0].width/2);
                this.edittingImage[0].y = (this.mY + 20);
                
                this.movingImage = true;
            }
            
        }
        
        image(this.selectedImage, this.edittingImage[0].x, this.edittingImage[0].y, this.edittingImage[0].width, this.edittingImage[0].height);
    }
    
    
    this.placeImage = function()
    {
        cursor(ARROW);
        //placing image
        if (this.mousePressOnCanvas() && !this.editMode)
        {
            updatePixels();
            self.currentImage = [];
            this.placing = true;
            this.startX = mouseX -(this.sliderValue + 100)/2;
            this.startY = mouseY -(this.sliderValue + 100)/2;
            image(this.selectedImage, this.startX, this.startY, 100 + this.sliderValue, 100 + this.sliderValue);
        }
        //incomplete image
        if (this.placing == true && !mouseIsPressed && !this.editMode)
        {
            updatePixels();
            this.editX = this.startX;
            this.editY = this.startY;
            image(this.selectedImage, this.startX, this.startY, 100 + this.sliderValue, 100 + this.sliderValue);
            this.currentImage.push({
                x: this.editX,
                y: this.editY,
                width: this.sliderValue + 100,
                height: this.sliderValue + 100
            });
            
            this.edittingImage.push({
                x: this.editX,
                y: this.editY,
                width: this.sliderValue + 100,
                height: this.sliderValue + 100
            });
            this.translationX = this.currentImage[0].x + this.currentImage[0].width/2;
            this.translationY = this.currentImage[0].y + this.currentImage[0].height/2;
            
            this.edittingImage[0].x = -(this.currentImage[0].width)/2;
            this.edittingImage[0].y = -(this.currentImage[0].height)/2;
            
            this.placing = false;
        }
        //calling the edit image function if edit mode is true
        if (this.editMode == true && this.placing == false)
        {
            this.drawCircles = true;
            updatePixels();
            this.editImage(); 
        }
    }

    this.mousePressOnCanvas = function()
    {
        if ((mouseX > this.canvasContainer.elt.offsetLeft - 70 && mouseX < this.canvasContainer.elt.offsetLeft + this.canvasWidth) && 
            (mouseY > this.canvasContainer.elt.offsetTop && mouseY < this.canvasContainer.elt.offsetTop + this.canvasHeight - 40) && mouseIsPressed) 
        {
            return true;
        }
        return false;
    }
    
    this.populateOptions = function()
    {
        loadPixels();
        
        this.options = select(".options");
        
        this.slider = createSlider(-100, 300, 0, 0);
        this.slider.parent(this.options);
        this.slider.id("sizeSlider");
        this.sizeLabel = createElement("sizeLabel");
        this.sizeLabel.parent(this.options);
        this.sizeLabel.html("<label for='sizeSlider'>Size</label>");
        
        this.slider2 = createSlider(0, 360, 0, 0);
        this.slider2.parent(this.options);
        this.slider2.id("rotationSlider");
        this.rotationLabel = createElement("rotationLabel");
        this.rotationLabel.parent(this.options);
        this.rotationLabel.html("<label for='rotationSlider'>RotationSlider</label>");
        
        
        this.selector = createSelect();
        this.selector.parent(this.options);
        this.selector.option("Duck");
        this.selector.option("Tree");
        this.selector.option("Zombie");
        this.selector.option("Viking");
        this.selector.value("Duck");
        
        this.editButton = createElement("editImage");
        this.editButton.parent(this.options);
        this.editButton.html("<button id='editImage'>Edit Image</button>");
        button1 = select("#editImage");
        button1.mouseClicked(function() {
            //enable edit mode when button is pushed
            self.editMode = true;
            self.placing = false;
        });
        
        this.completeButton = createElement("completeImage");
        this.completeButton.parent(this.options);
        this.completeButton.html("<button id='completeImage'>Complete Image</button>");
        button2 = select("#completeImage");
        button2.mouseClicked(function() {
            //completing the shape, clearing the current shape to begin a new
            if (self.editMode)
            {
                self.slider2.value(0);
                updatePixels();
                self.editMode = false;
                self.drawCircles = false;
                image(self.selectedImage, self.edittingImage[0].x, self.edittingImage[0].y, self.edittingImage[0].width, self.edittingImage[0].height);
                pop();
                loadPixels();
                self.currentImage = [];
                self.edittingImage = [];
            }
            else {
                updatePixels();
                image(self.selectedImage, self.currentImage[0].x, self.currentImage[0].y, self.currentImage[0].width, self.currentImage[0].height);
                loadPixels();
                self.currentImage = [];
                self.edittingImage = [];
            }
        });
    }
	
    this.unselectTool = function() {
		updatePixels();
		//clear options
		select(".options").html("");
	};
}