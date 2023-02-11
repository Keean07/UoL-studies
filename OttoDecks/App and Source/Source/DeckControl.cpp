#include "DeckControl.h"
#include <JuceHeader.h>


DeckControl::DeckControl()
{
    addAndMakeVisible(balanceSlider);
    balanceSlider.setTextBoxStyle(juce::Slider::NoTextBox, true, 0, 0);
    balanceSlider.addListener(this);
    balanceSlider.setRange(-1, 1);
    
    addAndMakeVisible(balanceLabel);
    balanceLabel.setText("Balancer", dontSendNotification);
    balanceLabel.attachToComponent(&balanceSlider, true);
    
    addAndMakeVisible(enableBalancer);
    enableBalancer.addListener(this);

}

DeckControl::~DeckControl()
{
}

void DeckControl::paint (juce::Graphics& g)
{
    g.setColour (juce::Colours::grey);
    std::cout << balancerEnabled << std::endl;
    colourChecker();
}

void DeckControl::resized()
{
    balanceSlider.setBounds(getWidth()/4, 0, getWidth()/4 * 3, getHeight()/2);
    enableBalancer.setBounds(0, getHeight()/2, getWidth(), getHeight()/4);
}

void DeckControl::buttonClicked (Button* button)
{
    if (button == &enableBalancer)
    {
        if (balancerEnabled)
        {
            balancerEnabled = false;
        }
        else if (!balancerEnabled)
        {
            balancerEnabled = true;
        }
    }
}

void DeckControl::sliderValueChanged (Slider* slider)
{
    if (slider == &balanceSlider)
    {
        newValue = balanceSlider.getValue();
    }
}

void DeckControl::colourChecker()
{
    if (balancerEnabled)
    {
        enableBalancer.setColour(TextButton::ColourIds::buttonColourId, Colours::limegreen);
        
    }
    else {
        enableBalancer.setColour(TextButton::ColourIds::buttonColourId, Colours::grey);
    }
}
