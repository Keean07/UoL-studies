#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "DJAudioPlayer.h"
#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>

//==============================================================================
/*
*/
class PlaylistComponent  : public juce::Component,
                            public TableListBoxModel,
                            public Button::Listener
{
public:
    PlaylistComponent();
    ~PlaylistComponent() override;
    void paint (juce::Graphics&) override;
    void resized() override;
    
    // Returns the number of rows (entries) in the playlist for the purpose of drawing the information to screen
    int getNumRows() override;
    
    // Used to paint the background of each row, either orange or grey, depending on whether they are selected or not
    void paintRowBackground (Graphics &,
                             int rowNumber,
                             int width,
                             int height,
                             bool rowIsSelected) override;
    
    // Overridden. Used to paint the information from the csv file into the table by taking each cell's information (row, width, height) and calling the read_row() function.
    void paintCell (Graphics &,
                    int rowNumber,
                    int columnId,
                    int width,
                    int height,
                    bool rowIsSelected) override;
    
    // Overridden. Used to alter a global variable indicating which row is currently selected by the user.
    void cellClicked (int rowNumber,
                      int columnId,
                      const MouseEvent &) override;

    // Overridden. Used to add functionality to each button individually
    void buttonClicked(Button* button) override;
    
    // Overriden. Used to change a global rowSelected variable to none.
    void backgroundClicked(const MouseEvent &) override;
    
    // Takes an audio files URL, and uses the format manager to return the tracks length.
    int trackDuration(URL audioURL);
    
    // Takes an array of files returned from the FileChooser, and creates a CSV document with the files' relevant information on.
    void create(Array<File> tempList);
    
    // Takes a track ID and iterates over the csv file, copying all the data to a new one. When it finds the relevant track, it skips it. Once the iteration is over, it renames the new file to playlist.csv - essentailly making it the new main csv file.
    void deleteRecord(int trackID);
    
    // Takes a search entry string, then iterates over the csv file rows, comparing the search entry to each of the song names. If the name contains the substring, then it writes that row onto a new file. Once all the rows have been iterated over, the new file is renamed as the main file.
    void songSearcher(String searchEntry);
    
    // Iterates over the csv file, counting each row, and returning the row count.
    void checkOldCount();
    
    // Takes a track ID, and a string as input. The string indicates what action needs to be performed, and the ID indicates the track that it needs to be performed on. This is used to retrieve data from the csv, such as track name or track length.
    String read_record(std::string action, int trackID);
    
    // Indicates which row is currently selected
    int activeCellRow;
    // Indicates if a row is currently selected
    bool rowSelected;
    // Indicates if a track is being loaded to deck1
    bool loadingDeck1 = false;
    // Indicates if a track is being loaded to deck2
    bool loadingDeck2 = false;
    
private:
    // Self-explanatory buttons
    TextButton loadPlaylistButton{"LOAD TRACKS INTO PLAYLIST"};
    TextButton removeSongButton{"REMOVE TRACK FROM PLAYLIST"};
    TextButton loadSong1Button{"LOAD DECK1"};
    TextButton loadSong2Button{"LOAD DECK2"};
    TextButton searchSongButton{"Search"};
    // Used to store song length
    int songLength;
    // Used as an index indicator when parsing csv
    int roll = 0;
    // Used to store the amount of songs in the displayed playlist
    int playlistEntries = 0;
    // Used to temporarily store the original amount of songs in playlist whilst performing a search
    int tempEntries = 0;
    // Used to store the original amount of songs in the playlist for when reopening the app
    int originalEntries = 0;
    // Used to store the song search string
    String searchEntry;
    // Searching box
    TextEditor searchBox;
    // Playlist Table
    TableListBox tableComponent;
    
    AudioFormatManager formatManager;
    std::unique_ptr<AudioFormatReaderSource> readerSource;
    AudioTransportSource transportSource;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (PlaylistComponent)
};
