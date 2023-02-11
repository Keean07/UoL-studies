#include <JuceHeader.h>
#include "PlaylistComponent.h"
#include <typeinfo>

//==============================================================================
PlaylistComponent::PlaylistComponent()
{
    addAndMakeVisible(tableComponent);
    tableComponent.getHeader().addColumn("TrackID", 1, 75);
    tableComponent.getHeader().addColumn("Track title", 2, 250);
    tableComponent.getHeader().addColumn("Track duration", 3, 100);
    tableComponent.getHeader().addColumn("File type", 4, 100);
    
    addAndMakeVisible(loadPlaylistButton);
    loadPlaylistButton.addListener(this);
    
    addAndMakeVisible(searchBox);
    searchBox.setWantsKeyboardFocus(true);
    searchBox.setTextToShowWhenEmpty("Search for a song...", Colour(0, 255, 0));
    
    addAndMakeVisible(searchSongButton);
    searchSongButton.addListener(this);
    
    searchEntry = "";
    
    addAndMakeVisible(loadSong1Button);
    loadSong1Button.addListener(this);
    addAndMakeVisible(loadSong2Button);
    loadSong2Button.addListener(this);
    
    addAndMakeVisible(removeSongButton);
    removeSongButton.addListener(this);
    
    tableComponent.setModel(this);
    
    formatManager.registerBasicFormats();

    checkOldCount();
    
    std::fstream playlistNew;
    playlistNew.open("playlistnew.csv", std::ios::out | std::ios::trunc);
    playlistNew.close();
    
    std::fstream playlistSearched;
    playlistNew.open("playlistSearched.csv", std::ios::out | std::ios::trunc);
    playlistNew.close();
}

PlaylistComponent::~PlaylistComponent()
{
}

void PlaylistComponent::paint (juce::Graphics& g)
{
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));

    g.setColour (juce::Colours::grey);
    g.drawRect (getLocalBounds(), 1);   // draw an outline around the component

    g.setColour (juce::Colours::white);
    g.setFont (14.0f);
    g.drawText ("PlaylistComponent", getLocalBounds(),
                juce::Justification::centred, true);   // draw some placeholder text
    
    for (int i = 0; i < tableComponent.getHeader().getNumColumns(true); i++)
    {
        tableComponent.getHeader().columnClicked(i, ModifierKeys::noModifiers);
    }
    
    tableComponent.getHeader().setStretchToFitActive(true);
    tableComponent.getHeader().resizeAllColumnsToFit(tableComponent.getWidth());
}

void PlaylistComponent::resized()
{
    tableComponent.setBounds(0, 0, getWidth()/4 * 3, getHeight());
    searchBox.setBounds(getWidth()/4*3, 0, getWidth()/4, getHeight()/4);
    searchSongButton.setBounds(getWidth()/8*7, 0, getWidth()/8, getHeight()/4);
    loadPlaylistButton.setBounds(getWidth()/4*3, getHeight()/4, getWidth()/4, getHeight()/4);
    loadSong1Button.setBounds(getWidth()/4*3, getHeight()/2, getWidth()/8, getHeight()/4);
    loadSong2Button.setBounds(getWidth()/8*7, getHeight()/2, getWidth()/8, getHeight()/4);
    removeSongButton.setBounds(getWidth()/4*3, getHeight()/4*3, getWidth()/4, getHeight()/4);
}

int PlaylistComponent::getNumRows()
{
    return double(playlistEntries);
}

void PlaylistComponent::paintRowBackground (Graphics & g,
                         int rowNumber,
                         int width,
                         int height,
                         bool rowIsSelected)
{
    //highlight selected rows
    if (rowIsSelected)
    {
        g.fillAll(Colours::limegreen);
    }
    else {
        g.fillAll(Colours::darkgrey);
    }
}

void PlaylistComponent::paintCell (Graphics & g,
                int rowNumber,
                int columnId,
                int width,
                int height,
                bool rowIsSelected)
{
    if (columnId == 1)
    {
        g.drawText(read_record("roll", rowNumber), // the important bit
                   2, 0,
                   width - 4,
                   height,
                   Justification::centredLeft, true);
    }
    else if (columnId == 2)
    {
        g.drawText(read_record("name", rowNumber), // the important bit
                   2, 0,
                   width - 4,
                   height,
                   Justification::centredLeft, true);
    }
    else if (columnId == 3)
    {
        g.drawText(read_record("duration", rowNumber), // the important bit
                   2, 0,
                   width - 4,
                   height,
                   Justification::centredLeft, true);
    }
    else if (columnId == 4)
    {
        g.drawText(read_record("type", rowNumber), // the important bit
                   2, 0,
                   width - 4,
                   height,
                   Justification::centredLeft, true);
    }
}

void PlaylistComponent::cellClicked(int rowNumber,
                  int columnId,
                  const MouseEvent &)
{
    activeCellRow = rowNumber;
    rowSelected = true;
}

void PlaylistComponent::backgroundClicked(const MouseEvent &)
{
    rowSelected = false;
    activeCellRow = NULL;
}

void PlaylistComponent::buttonClicked(Button* button)
{
    if (button == &loadPlaylistButton)
    {
        FileChooser chooser ("Select an audio file to play...");
        if (chooser.browseForMultipleFilesToOpen())
        {
            Array<File> tempList = chooser.getResults();
            create(tempList);
        }
    }
    
    if (button == &removeSongButton)
    {
        if (rowSelected)
        {
            read_record("remove", activeCellRow);
            tableComponent.updateContent();
        }
    }
    
    if (button == &loadSong1Button)
    {
        if (rowSelected)
        {
            loadingDeck1 = true;
        }
    }
    
    if (button == &loadSong2Button)
    {
        if (rowSelected)
        {
            loadingDeck2 = true;
        }
    }
    
    if (button == &searchSongButton)
    {
        if (!searchBox.isEmpty())
        {
            playlistEntries = originalEntries;
            rename("playlistOriginal.csv", "playlist.csv");
            songSearcher(searchBox.getText());
        }
        else if (searchBox.isEmpty())
        {
            playlistEntries = tempEntries;
            rename("playlistOriginal.csv", "playlist.csv");
        }
    }
}

int PlaylistComponent::trackDuration(URL audioURL)
{
    auto* reader = formatManager.createReaderFor(audioURL.createInputStream(URL::InputStreamOptions{ URL::ParameterHandling::inAddress }));
    if (reader != nullptr) // good file!
    {
        songLength = reader->lengthInSamples/reader->sampleRate;
        return songLength;
    }
    else {
        return 0;
    }
}

void PlaylistComponent::create(Array<File> tempList)
{
    std::fstream fout;

    fout.open("playlist.csv", std::ios::out | std::ios::app);

    std::string fileName, fileType, filePath, fileDuration;

    for (int i = 0; i < tempList.size(); i++)
    {

        playlistEntries += 1;
        roll = playlistEntries;
        
        std::string rollString = std::to_string(roll);

        fileName = tempList[i].getFileName().toStdString();
        filePath = URL{tempList[i]}.toString(false).toStdString();
        fileDuration = std::to_string(trackDuration( URL { tempList[i] }));
        fileType = tempList[i].getFileExtension().toStdString();

        // Insert the data to file
        fout << rollString << ","
             << fileName << ","
             << filePath << ","
             << fileDuration << ","
             << fileType
             << "\n";

        tableComponent.updateContent();
    }
    originalEntries = playlistEntries;
}

String PlaylistComponent::read_record(std::string action, int trackID)
{
    // File pointer
    std::fstream fin;
  
    // Open an existing file
    fin.open("playlist.csv", std::ios::in);
    
    std::vector<std::vector<std::string>> content;
    std::vector<std::string> row;
    std::string line, word, result;
    
    int roll2, count = 0;
    trackID += 1;
    
    if (fin.is_open())
    {
        while (getline(fin, line))
        {
            row.clear();
 
            std::stringstream str(line);
 
            while (getline(str, word, ','))
            {
                row.push_back(word);
            }
            content.push_back(row);
        }
        
        for (int i = 0; i < content.size(); i++)
        {
            // convert string to integer for comparision
            roll2 = stoi(content[i][0]);

            // Compare the roll number
            if (roll2 == trackID)
            {
                if (action == "roll")
                {
                    count = 1;
                    result = content[i][0];
                    break;
                }
                else if (action == "name")
                {
                    count = 1;
                    result = content[i][1];
                    break;
                }
                else if (action == "path")
                {
                    count = 1;
                    result = content[i][2];
                    break;
                }
                else if (action == "duration")
                {
                    count = 1;
                    result = content[i][3] + " seconds";
                    break;
                }
                else if (action == "type")
                {
                    count = 1;
                    result = content[i][4];
                    break;
                }
                else if (action == "remove")
                {
                    count = 1;
                    deleteRecord(trackID);
                    result = "";
                    break;
                }
            }
            if (count == 0)
            {
                std::cout << "Record not found\n" << std::endl;
                result = "NaN";
            }
        }
    }
    else {
        std::cout<<"Could not open the file\n" << std::endl;
    }
    return result;
}

void PlaylistComponent::deleteRecord(int trackID)
{
    std::fstream fin, fout;
  
    fin.open("playlist.csv", std::ios::in);
  
    fout.open("playlistnew.csv", std::ios::out);
  
    int roll1, count = 0;
    
    std::vector<std::vector<std::string>> content;
    std::vector<std::string> row;
    std::string line, word, result;

    // Check if this record exists, if exists, leave it and add all other data to the new file
    if (fin.is_open() && fout.is_open() && !fin.eof())
    {
        while (getline(fin, line))
        {
            row.clear();
            std::stringstream str(line);
            
            while (getline(str, word, ','))
            {
                row.push_back(word);
            }
            content.push_back(row);
        }
        for (int i = 0; i < content.size(); i++)
        {
            float row_size = content[i].size();
            
            // convert string to integer for comparision
            roll1 = stoi(content[i][0]);
            
            // Compare the roll number
            if (roll1 != trackID)
            {
                if (count == 1)
                {
                    content[i][0] = std::to_string(std::stoi(content[i][0]) - 1);
                }
                for (int j = 0; j < content[i].size() - 1; j++)
                {
                    fout << content[i][j] << ",";
                }
                fout << content[i][row_size-1] << "\n";
            }
            else {
                count = 1;
                playlistEntries -= 1;
            }
        }
        if (count == 1)
        {
            std::cout << "Record deleted\n" << std::endl;
        }
        else {
            std::cout << "Record not found\n" << std::endl;
        }
        // Close the pointers
        fin.close();
        fout.close();
        
        // Ensure that playlist file is clear
        std::fstream playlist;
        playlist.open("playlist.csv", std::ios::out | std::ios::trunc);
        playlist.close();
      
        // renaming the new file with the existing file name
        rename("playlist.csv", "playlisttemp.csv");
        rename("playlistnew.csv", "playlist.csv");
        rename("playlisttemp.csv", "playlistnew.csv");
    }
}

void PlaylistComponent::songSearcher(String searchEntry)
{
    // Ensure that playlistSearched file is clear
    std::fstream playlistSearched;
    playlistSearched.open("playlistSearched.csv", std::ios::out | std::ios::trunc);
    playlistSearched.close();
    
    std::fstream fin, fout, foriginal;
    
    fin.open("playlist.csv", std::ios::in);
    fout.open("playlistSearched.csv", std::ios::out);
  
    int index, entryCounter = 0, count = 0;
    std::vector<std::vector<std::string>> content;
    std::vector<std::string> row;
    std::string line, word;
    
    String songName;
    
    if (fin.is_open() && fout.is_open() && !fin.eof())
    {
        // Parses csv to store data
        while (getline(fin, line))
        {
            row.clear();
 
            std::stringstream str(line);
 
            while (getline(str, word, ','))
            {
                row.push_back(word);
            }
            content.push_back(row);
        }
        for (int i = 0; i < content.size(); i++)
        {
            float row_size = content[i].size();
            
            index = stoi(content[i][0]);
            songName = content[i][1];
            
            // Compare search entry to song name, if match, write song to new file
            if (songName.containsIgnoreCase(searchEntry))
            {
                count += 1;
                entryCounter += 1;
            
                fout << entryCounter << ",";
                for (int j = 1; j < content[i].size() - 1; j++)
                {
                    fout << content[i][j] << ",";
                }
                fout << content[i][row_size-1] << "\n";
            }
        }
        if (count > 0)
        {
            // If results were found, change the amount of songs to display
            std::cout << "Records found\n" << std::endl;
            tempEntries = playlistEntries;
            playlistEntries = count;
            tableComponent.updateContent();
        }
        else {
            std::cout << "No record found\n" << std::endl;
        }
        // Close the pointers
        fin.close();
        fout.close();
      
        // renaming the new file with the existing file name to display search results
        rename("playlist.csv", "playlistOriginal.csv");
        rename("playlistSearched.csv", "playlist.csv");
    }
}

void PlaylistComponent::checkOldCount()
{
    // Open an existing file
    std::fstream playlist;
    playlist.open("playlist.csv", std::ios::in);
    
    std::vector<std::vector<std::string>> content;
    std::vector<std::string> row;
    std::string line, word;
    
    if (playlist.is_open())
    {
        while (getline(playlist, line))
        {
            row.clear();
 
            std::stringstream str(line);
 
            while (getline(str, word, ','))
            {
                row.push_back(word);
            }
            content.push_back(row);
        }
        playlistEntries = content.size();
    }
}
