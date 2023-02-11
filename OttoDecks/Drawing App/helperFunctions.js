function HelperFunctions() {

	//p5.dom click click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	//event handler for the clear button event. Clears the screen
    
	select("#clearButton").mouseClicked(function() {
            toolbox.tools[7].flames = [];
            toolbox.tools[4].currentShape = [];
            toolbox.tools[4].editingShape = [];
            background(255,255,255);
            //call loadPixels to update the drawing state
            //this is needed for the mirror tool
            loadPixels();
	});

	//event handler for the save image button. saves the canvsa to the
	//local file system.
	select("#saveImageButton").mouseClicked(function() {
		saveCanvas("myCanvas", "jpg");
	});
    
    //add event handler for tranversing pixels[]
    
//    select("#undoButton").mouseClicked(function() {
//        updatePixels();
//    });
    
    select("#redoButton").mouseClicked(function() {
        //sadly, this is left incomplete due to lack of brainpower and time
    });
}