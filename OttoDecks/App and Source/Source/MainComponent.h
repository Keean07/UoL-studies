/*
  ==============================================================================

    This file was auto-generated!

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "DJAudioPlayer.h"
#include "DeckGUI.h"
#include "PlaylistComponent.h"
#include "DeckControl.h"
#include <iostream>
#include <vector>

//==============================================================================
/*
    This component lives inside our window, and this is where you should put all
    your controls and content.
*/
class MainComponent   : public AudioAppComponent
{
public:
    //==============================================================================
    MainComponent();
    ~MainComponent();

    //==============================================================================
    void prepareToPlay (int samplesPerBlockExpected, double sampleRate) override;
    void getNextAudioBlock (const AudioSourceChannelInfo& bufferToFill) override;
    void releaseResources() override;

    //==============================================================================
    void paint (Graphics& g) override;
    void resized() override;
    // Used to balance the gains from deckgui1 & deckgui2
    void balancePlayer();

private:
    //==============================================================================
    // Audio Mixer
    MixerAudioSource mixerSource;
    //Audio Format Manager
    AudioFormatManager formatManager;
    // Audio thumbnal cache for waveframe
    AudioThumbnailCache thumbCache{100};
    
    // Two audio players
    DJAudioPlayer player1{formatManager};
    DJAudioPlayer player2{formatManager};
    
    // One playlist
    PlaylistComponent playlistComponent;
    
    // Two deckGUIs
    DeckGUI deckGUI1{&player1, formatManager, thumbCache, playlistComponent};
    DeckGUI deckGUI2{&player2, formatManager, thumbCache, playlistComponent};
    
    // Deck Control Component
    DeckControl  deckControl;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (MainComponent)
};
