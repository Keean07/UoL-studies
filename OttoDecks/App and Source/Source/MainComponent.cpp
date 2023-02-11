/*
  ==============================================================================

    This file was auto-generated!

  ==============================================================================
*/

#include "MainComponent.h"

//==============================================================================
MainComponent::MainComponent()
{
    // Make sure you set the size of the component after
    // you add any child components.
    setSize (800, 600);

    // Some platforms require permissions to open input channels so request that here
    if (RuntimePermissions::isRequired (RuntimePermissions::recordAudio)
        && ! RuntimePermissions::isGranted (RuntimePermissions::recordAudio))
    {
        RuntimePermissions::request (RuntimePermissions::recordAudio,
                                     [&] (bool granted) { if (granted)  setAudioChannels (2, 2); });
    }  
    else
    {
        // Specify the number of input and output channels that we want to open
        setAudioChannels (0, 2);
    }
    
    formatManager.registerBasicFormats();
    
    addAndMakeVisible(deckGUI1);
    deckGUI1.setName("deckGUI1");
    addAndMakeVisible(deckGUI2);
    deckGUI2.setName("deckGUI2");
    
    addAndMakeVisible(deckControl);
    
    addAndMakeVisible(playlistComponent);
}

MainComponent::~MainComponent()
{
    // This shuts down the audio device and clears the audio source.
    shutdownAudio();
}

//==============================================================================

void MainComponent::prepareToPlay (int samplesPerBlockExpected, double sampleRate)
{
    mixerSource.addInputSource(&player1, false);
    mixerSource.addInputSource(&player2, false);
    player1.prepareToPlay(samplesPerBlockExpected, sampleRate);
    player2.prepareToPlay(samplesPerBlockExpected, sampleRate);
}

void MainComponent::getNextAudioBlock (const AudioSourceChannelInfo& bufferToFill)
{
    mixerSource.getNextAudioBlock(bufferToFill);
}

void MainComponent::releaseResources()
{
    mixerSource.removeAllInputs();
    mixerSource.releaseResources();
    player1.releaseResources();
    player2.releaseResources();
}

//==============================================================================
void MainComponent::paint (Graphics& g)
{
    g.fillAll (getLookAndFeel().findColour (ResizableWindow::backgroundColourId));
    balancePlayer();
}

void MainComponent::resized()
{
    deckGUI1.setBounds(0, 0, getWidth()/2, getHeight() * 2/3);
    deckGUI2.setBounds(getWidth()/2, 0, getWidth()/2, getHeight() * 2/3);
    playlistComponent.setBounds(0, getHeight() * 2/3, getWidth()/4*3, getHeight() * 1/3);
    deckControl.setBounds(getWidth()/4 * 3, getHeight() * 2/3, getWidth()/4, getHeight() * 1/3);
}

void MainComponent::balancePlayer()
{
    if (deckControl.balancerEnabled)
    {
        deckGUI1.djAudioPlayer->setGain(-(deckControl.newValue) + 1);
        deckGUI2.djAudioPlayer->setGain(deckControl.newValue + 1);
    }
}
