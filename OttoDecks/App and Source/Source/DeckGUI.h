#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "DJAudioPlayer.h"
#include "WaveformDisplay.h"
#include "PlaylistComponent.h"
#include <vector>

//==============================================================================
/*
*/
class DeckGUI  : public juce::Component,
                 public Button::Listener,
                 public Slider::Listener,
                 public FileDragAndDropTarget,
                 public Timer
{
    public:
        DeckGUI(DJAudioPlayer* _djAudioPlayer,
                AudioFormatManager &formatManagerToUse,
                AudioThumbnailCache &cacheToUse,
                PlaylistComponent &playlistComponent);
        ~DeckGUI() override;
        void paint (juce::Graphics&) override;
        void resized() override;
        // Used to add button functionality to each button individually
        void buttonClicked (Button *) override;
        // Used to reach into djAudioPlayer and change the track based on slider values
        void sliderValueChanged (Slider *slider) override;
        // Overridden to return true when file is hovering over dropping area
        bool isInterestedInFileDrag(const StringArray& files) override;
        // Overridden to load the file if it is singular
        void filesDropped(const StringArray& files, int x, int y) override;
        // Overridden to repaint the new playhead position
        void timerCallback() override;
        // Changes mouse cursor when hovering over any of the buttons
        void cursorCheck();
        // Checks if mouse is held on rewind button, acts accordingly
        void rewindCheck();
        // Checks if mouse id held on fast forward button, acts accordingly
        void playlistLoading();
        // Used to load songs into the djAudioPlayers from the playlist component
        void hoverColourChanger();
        
        DJAudioPlayer* djAudioPlayer;


    private:
        TextButton playButton{"PLAY"};
        TextButton pauseButton{"PAUSE"};
        TextButton forwardButton{"FORWARD>>"};
        TextButton rewindButton{"<<REWIND"};
        TextButton loadButton{"LOAD FILE TRACK"};
        TextButton loadPlaylistButton{"LOAD PLAYLIST TRACK"};
        TextButton stopButton{"STOP"};

        Slider gainSlider;
        Slider speedSlider;
        Slider posSlider;
        
        // The angle at which the vinyl rotates
        float angle;
    
        Image image;
    
        Label gainLabel;
        Label speedLabel;
        Label posLabel;
    
        Label songTitle;
    
        // Vector storing the buttons
        std::vector<TextButton *> guiButtons;
    
        PlaylistComponent &playlistComponent;
    
        WaveformDisplay waveformDisplay;
        
        JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (DeckGUI)
};
