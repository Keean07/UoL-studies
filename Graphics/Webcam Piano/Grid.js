class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w; // Grid Width
    this.gridHeight = _h; // Grid Height
    this.notes = []; // Array of notes
    this.noteSize = 40; // Note Size
    this.monoSynth = new p5.MonoSynth(); // Mono Synth Object
    // Array of different types of MonoSynth Notes
    this.synthNotes = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", 
                      "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", 
                      "C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7",
                      "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7",
                      "E0", "E1", "E2", "E3", "E4", "E5", "E6", "E7",
                      "F0", "F1", "F2", "F3", "F4", "F5", "F6", "F7",
                      "G0", "G1", "G2", "G3", "G4", "G5", "G6", "G7"];

    // Initalise grid structure and state
    for (var x=0; x<_w; x+=this.noteSize) {
      for (var y=0; y<_h; y+=this.noteSize) {
        // Create position vector for this note
        var pos = createVector(x + this.noteSize/2, y + this.noteSize/2);
        // Create new note at this position
        var note = new Note(pos, 0, this.gridWidth, this.gridHeight);
        // Push note to notes array
        this.notes.push(note);
      }
    }
    // Run assignNotes()
    this.assignNotes();
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes();
  }

  // Function to traverse notes array and assign each note a monosynth note
  assignNotes() {
    for (var i = 0; i < this.notes.length; i++) {
      this.notes[i].note = this.synthNotes[i%this.synthNotes.length];
    }
  }
  /////////////////////////////////
  drawActiveNotes(){
    // Iterate through all notes and call drawNote function
    for (var i=0; i<this.notes.length; i++){
      this.notes[i].drawNote();
      // If note is active and hasn't played its tune for this activation
      if (this.notes[i].noteState>0 && this.notes[i].playing == true) {
        // Call playSynth and set playing to false for this activation
        this.playSynth(this.notes[i].note);
        this.notes[i].playing = false;
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    // Iterate through all nots and call findNode
    for (var i = 0; i < this.notes.length; i++) {
      this.notes[i].findNote(img);
    }
  }

  // Function that plays the synth note argument
  playSynth(note) {
    userStartAudio();
    let velocity = 1;
    let time = 0;
    let dur = 1/100;
    this.monoSynth.play(note, velocity, time, dur);
  }
}
