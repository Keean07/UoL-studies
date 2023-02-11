#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include <iostream>
class DJAudioPlayer : public AudioSource
{
    public:
        DJAudioPlayer(AudioFormatManager& _formatManager);
        ~DJAudioPlayer();
        // Loads in audio file via URL
        void loadURL(URL file);
        // Starts playing the file
        void play();
        // Stops playing the file
        void stop();
        // Pause playing the file
        void pause();
        // Takes songs sets sampling position
        void setPosition(double posInSecs);
        // Gets sampling position
        double getPosition();
        // Sets volume of track
        void setGain(double gain);
        // Sets speed of track
        void setSpeed(double ratio);
    
        /** initialisation of pure virtual functions */
        void prepareToPlay (int samplesPerBlockExpected, double sampleRate) override;
        void getNextAudioBlock (const AudioSourceChannelInfo& bufferToFill) override;
        void releaseResources() override;
    
        // Takes a relative (0 <= x <= 1) position in the song and sets the songs position
        void setPositionRelative(double pos);
        // Returns the relative position of the playhead
        double getPositionRelative();
        
        // Player states
        bool isPlaying = false;
        bool isLoaded = false;
        bool isPaused = false;
    
    private:
        AudioFormatManager& formatManager;
        std::unique_ptr<AudioFormatReaderSource> readerSource;
        AudioTransportSource transportSource;
        ResamplingAudioSource resampleSource{&transportSource, false, 2};
    
        // Stores song length
        float songLength;
        // Stores where the song was paused
        double pauseTime;
        // Stores the point at which the song was paused
        double pausePosition;
};
