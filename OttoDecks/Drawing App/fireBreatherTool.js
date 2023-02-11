/*this might be tedious
1. create a constructor function that adds flames to an array
2. create a construction function that adds particles to these flames
3. create a visualisation for these particles
4. create movement for these particles
5. loop the creation of these particles to each flame
6. create flames by mouse click

Progress log: so we have successfully created different variations of the flame, but now we are trying to create a container for a flame so that we can have multiple instances 
running simultaneously using different x coordinates
*/
function fireBreatherTool()
{
    this.name = "fireBreatherTool";
    this.icon = "assets/fireBreatherTool.jpg";
    
    self = this;
    
    this.canvasContainer = select("#content");
    this.canvasWidth = this.canvasContainer.size().width;
    this.canvasHeight = this.canvasContainer.size().height;
    
    this.flames = [];
    this.flame;
    this.particles = [];
    this.particleNum = 500;
    
    this.startNum = 0;
    this.fireIsBurning = fireIsBurning;
    
    
    
    this.draw = function() 
    {   
        updatePixels();
        if (mouseIsPressed && this.mousePressOnCanvas())
        {
            fireIsBurning = true;
            //array that stores individual flames, to allow for multiple flame to be displayed
            this.flame = {startX: mouseX, 
                          startY: mouseY, 
                          startRadius: random(30, 50)};
            this.flames.push(this.flame);
        }
        this.drawParticles();
    }
    
    this.drawParticles = function()
    {
        for (var j = 0; j < this.flames.length; j++)
        {
            //adding particles to the array based on mouse coordinates
            this.p = new flameParticle(this.flames[j].startX, this.flames[j].startY, this.flames[j].startRadius);
            this.particles.push(this.p);
        }
        for (var i = 0; i < this.particles.length; i++)
        {
            //displaying and manipulating particles over the particles[] array
            this.particles[i].display();
            this.particles[i].movement();
            this.particles[i].shrink();
            if (this.particles[i].size < 1)
            {
                //removing particles that have shrunk below 0px and adding a new one at its original position for the effect of an eternal burning flame (eternal being your cpu's lifespan)
                this.newP = new flameParticle(this.particles[i].originalX, this.particles[i].originalY, this.startRadius);
                this.particles.push(this.newP);
                this.particles.splice(i, 1);
            }
        }
    }
    //class from which particles will be created and manipulated
    class flameParticle{
        constructor(initialX, initialY, radius)
        {
            this.x = initialX;
            this.y = initialY;
            this.size = radius;
            this.color = (255);
            this.random = random(3);
            
            this.originalX = initialX;
            this.originalY = initialY;

            if (this.random < 1)   //color selector for particles
            {
                this.color = color(200, 0, 0, 90);  //red
            }
            else if (this.random >= 1 && this.random < 2)
            {
                this.color = color(255, 120, 0, 90);  //orange
            }
            else if (this.random > 2)
            {
                this.color = color(255, 255, 0, 90);  //yellow
            }
        }
        display() {
            push();
            noStroke();
            fill(this.color);
            ellipse(this.x, this.y, this.size);
            pop();
        }

        movement() {
            this.x = this.x + random(-3, 3);
            this.y = this.y - random(1, 3);
        }

        shrink() {
            this.size = this.size - 0.4;
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
        
	this.unselectTool = function() 
    {
		updatePixels();
		//clear options
		select(".options").html("");
	};
}