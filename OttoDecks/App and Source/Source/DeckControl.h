#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "DJAudioPlayer.h"
#include "WaveformDisplay.h"
#include "PlaylistComponent.h"
#include "DeckGUI.h"
#include <vector>
#include <iostream>

//==============================================================================
class DeckControl  : public juce::Component,
                     public Button::Listener,
                     public Slider::Listener

{
    public:
    // This component implements the music balancer, allowing the user to choose which deck they want to hear more of
        DeckControl();
        ~DeckControl() override;
        void paint (juce::Graphics&) override;
        void resized() override;
        // Used to add button functionality to each button individually
        void buttonClicked (Button *) override;
        // Used to detect when the slider value changes and save its value
        void sliderValueChanged (Slider *slider) override;
        // Used to check whether the balancer is enabled, and if so, turning the button green
        void colourChecker();
        // Used to store the sliders new value to transport to MainComponent
        double newValue;
        // Used to flag whether the balancer is enabled or not .
        bool balancerEnabled = false;

    private:
        Slider balanceSlider;
        Label balanceLabel;
        TextButton enableBalancer{"Enable Balancer"};
        bool valueChanged;
    
        JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (DeckControl)
};
