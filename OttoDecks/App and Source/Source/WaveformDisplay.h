#pragma once

#include "../JuceLibraryCode/JuceHeader.h"

//==============================================================================
/*
*/
class WaveformDisplay  : public juce::Component, public ChangeListener
{
    public:
        WaveformDisplay(AudioFormatManager &formatManagerToUse,
                        AudioThumbnailCache &cacheToUse);
        ~WaveformDisplay() override;

        void paint (juce::Graphics&) override;
        // Takes a URL from an audio file, and sets it as the audioThumbnail source to map wavefrom display
        void loadURL(URL audioURL);
        // If there has been a change (new file), it does a repaint
        void changeListenerCallback(ChangeBroadcaster *source) override;
        // Takes the current position in the song and sets the playheads position relative.
        void setPositionRelative(double pos);
        // Overriden. When the mouse is pressed on the waveform, it captures the location and moves the playhead accordingly.
        void mouseDown(const MouseEvent &event) override;
        // Simply used to change global variable
        void mouseUp(const MouseEvent &event) override;
        // Overridden. Captures the mouses position as it is dragged and moves the playhead accordingly.
        void mouseDrag(const MouseEvent &event) override;
        // Overridden. Changes mouses cursor on hover.
        void mouseEnter(const MouseEvent &event) override;
    
        // Indicates whether a file is loaded.
        bool fileLoaded;
        // Indicates whether the mouse is being pressed.
        bool isDown = false;
        // Stores the new x coordinate of the mouse
        double newX;
    
    private:
        AudioThumbnail audioThumbnail;
        // Stores current position in song.
        double position;
    
        JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (WaveformDisplay)
};
