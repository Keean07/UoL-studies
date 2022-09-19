class Note {
    /////////////////////////////////
    constructor(pos, state, _w, _h) {
        this.noteX = pos.x; // x position
        this.noteY = pos.y; // y position
        this.noteSize = 40; // size of note
        this.noteState = state; // state of note
        this.width = _w; // grid width
        this.height = _h; // grid height
        this.note; // Monosynth note
        this.playing = false; // Flag indicating whether the note has been played for the activation
        this.rotationDirection = random(-1,1); // Random value determining rotation direction
    }
    /////////////////////////////////
    drawNote(){
        // An adaption of the drawActiveNotes function in the Grid.js file.
        fill(255);
        noStroke();
        if (this.noteState>0) { // If note is actived
            let alpha = this.noteState * 200;
            let c1 = color(255,0,0,alpha);
            let c2 = color(0,255,0,alpha);
            let mix = lerpColor(c1, c2, map(this.noteX, 0, this.width, 0, 1));
            fill(mix);
            let s = this.noteState;
            // Disabled original ellipse drawing to call the drawCirc function below
            // ellipse(x, y, this.noteSize*s, this.noteSize*s);
            this.drawCirc(this.noteX, this.noteY, this.noteSize, s, mix);
        } else {
            this.playing = false;
        }
        this.noteState-=0.05;
        this.noteState=constrain(this.noteState,0,1);
    }
    /////////////////////////////////
    findNote(img){
        // Adaption from findActiveNotes function in the Grid.js file.
        // Create new X and Y coordinates that are mapped from the grid coordinates to the diffImage coordinates
        let newX = map(this.noteX, 0, this.width, 0, img.width);
        let newY = map(this.noteY, 0, this.width, 0, img.width);
        // Use new coordinates to find the index of the relevant pixel number
        let index = (newX + (newY * img.width)) * 4;
        // Get the red color value of the corresponding pixel
        let imgR = img.pixels[index + 0];
        if (imgR==0) { // if pixel is black (ie there is movement) set note to actived
            this.noteState = 1;
            this.playing = true;
        }
    }

    // Custom function that draws the circle as well as flower
    drawCirc(x, y, noteSize, state, col) {
        push();
            fill(col);
            // Draw circle
            ellipse(x, y, noteSize*state, noteSize*state);
            // Create inverted color for flower
            let invrtCol = color(255-red(col), 255-green(col), 255-blue(col), alpha(col));
            fill(invrtCol);
            push();
                // Translate to note coordinates
                translate(x, y);
                // Rotation for the flower
                rotate(frameCount*this.rotationDirection*2);
                // Draw 6 circles, rotating after each one.
                for (let i = 0; i < 360; i+=60) {
                    push();
                        angleMode(DEGREES);
                        rotate(i);
                        ellipse(0, 0, 10*state, 40*state);
                    pop();
                }
            pop();
        pop();
    }

  }
  