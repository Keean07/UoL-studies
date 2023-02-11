#include <JuceHeader.h>
#include "DeckGUI.h"
#include <cmath>

//==============================================================================
DeckGUI::DeckGUI(DJAudioPlayer* _djAudioPlayer,
                 AudioFormatManager &formatManagerToUse,
                 AudioThumbnailCache &cacheToUse,
                 PlaylistComponent &playlistComponent):
                playlistComponent(playlistComponent),
                djAudioPlayer(_djAudioPlayer),
                waveformDisplay(formatManagerToUse, cacheToUse)
{
    addAndMakeVisible(playButton);
    addAndMakeVisible(pauseButton);
    addAndMakeVisible(forwardButton);
    addAndMakeVisible(rewindButton);
    addAndMakeVisible(loadButton);
    addAndMakeVisible(loadPlaylistButton);
    addAndMakeVisible(stopButton);
    addAndMakeVisible(gainSlider);
    addAndMakeVisible(speedSlider);
    addAndMakeVisible(posSlider);
    addAndMakeVisible(waveformDisplay);
    
    addAndMakeVisible(songTitle);
    songTitle.setText("Title: ", dontSendNotification);
    addAndMakeVisible(gainLabel);
    gainLabel.setText("Gain", dontSendNotification);
    gainLabel.attachToComponent(&gainSlider, false);
    addAndMakeVisible(speedLabel);
    speedLabel.setText("Speed", dontSendNotification);
    speedLabel.attachToComponent(&speedSlider, false);
    addAndMakeVisible(posLabel);
    posLabel.setText("Pos", dontSendNotification);
    posLabel.attachToComponent(&posSlider, false);
    
    playButton.addListener(this);
    pauseButton.addListener(this);
    forwardButton.addListener(this);
    rewindButton.addListener(this);
    loadButton.addListener(this);
    loadPlaylistButton.addListener(this);
    stopButton.addListener(this);
    
    guiButtons.push_back(&playButton);
    guiButtons.push_back(&pauseButton);
    guiButtons.push_back(&forwardButton);
    guiButtons.push_back(&rewindButton);
    guiButtons.push_back(&loadButton);
    guiButtons.push_back(&loadPlaylistButton);
    guiButtons.push_back(&stopButton);
    
    gainSlider.addListener(this);
    gainSlider.setSliderStyle(Slider::SliderStyle::Rotary);
    posSlider.addListener(this);
    posSlider.setSliderStyle(Slider::SliderStyle::Rotary);
    speedSlider.addListener(this);
    speedSlider.setSliderStyle(Slider::SliderStyle::Rotary);
    
    gainSlider.setRange(0.0, 1.0);
    gainSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 70, 20);
    speedSlider.setRange(0.1, 7.0);
    speedSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 70, 20);
    posSlider.setRange(0.0, 1.0);
    posSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 70, 20);
    
    gainSlider.setValue(0.2);
    speedSlider.setValue(1);

    /** 200 means call the function every 200ms */
    startTimer(200);
    startTimerHz(60);
    
    angle = 0.0f;
}

DeckGUI::~DeckGUI()
{
    stopTimer();
}

void DeckGUI::paint (juce::Graphics& g)
{
    g.fillAll(Colour(150,0,150));
    
    g.setColour (juce::Colours::grey);
    g.drawRect (getLocalBounds(), 2);   // draw an outline around the component

    
    image = ImageCache::getFromFile(File::getCurrentWorkingDirectory().getChildFile("Images/dj_vinyl.png"));

    auto componentArea = getLocalBounds();
    auto imageBounds = image.getBounds().toFloat();
    auto scaleWidth = componentArea.getWidth() / imageBounds.getWidth();
    auto scaleHeight = componentArea.getHeight() / imageBounds.getHeight();
    
    auto transform = juce::AffineTransform::scale(scaleWidth, scaleHeight).rotated(angle, componentArea.getWidth() / 2, componentArea.getHeight() / 2);
    
    g.drawImageTransformed(image,transform);
    
    if (djAudioPlayer->isPlaying && djAudioPlayer->isLoaded && !djAudioPlayer->isPaused)
    {
        angle += 0.05 + (speedSlider.getValue()/20);
    }
    
    if (waveformDisplay.isDown && waveformDisplay.fileLoaded)
    {
        djAudioPlayer->setPositionRelative(waveformDisplay.newX);
    }

    cursorCheck();
    rewindCheck();
    playlistLoading();
    hoverColourChanger();
}

void DeckGUI::resized()
{
    double rowH = getHeight() / 12;
    
    // Other
    waveformDisplay.setBounds(0, 0, getWidth(), rowH * 2);
    songTitle.setBounds(0, rowH * 2, getWidth()/2, rowH * 3);
    
    // Sliders
    gainSlider.setBounds(0, rowH * 7, getWidth()/3, rowH * 3);
    speedSlider.setBounds(getWidth()/3 * 2, rowH * 7, getWidth()/3, rowH * 3);
    posSlider.setBounds(getWidth()/3, rowH * 7, getWidth()/3, rowH * 3);
    
    // Buttons
    playButton.setBounds(0, rowH * 10, getWidth()/4, rowH);
    pauseButton.setBounds(getWidth()/4, rowH * 10, getWidth()/4, rowH);
    rewindButton.setBounds(getWidth()/2, rowH * 10, getWidth()/4, rowH);
    forwardButton.setBounds(getWidth()/4*3, rowH * 10, getWidth()/4, rowH);
    loadButton.setBounds(0, rowH * 11, getWidth()/4, rowH);
    loadPlaylistButton.setBounds(getWidth()/4, rowH * 11, getWidth()/4, rowH);
    stopButton.setBounds(getWidth()/2, rowH * 11, getWidth()/2, rowH);
}

void DeckGUI::buttonClicked(Button* button)
{    
    if (button == &playButton )
    {
        djAudioPlayer->setPosition(0);
        djAudioPlayer->play();
    }
    if (button == &pauseButton)
    {
        djAudioPlayer->pause();
    }
    if (button == &stopButton )
    {
        djAudioPlayer->stop();
    }
    if (button == &loadButton )
    {
        FileChooser chooser ("Select an audio file to play...");
        if (chooser.browseForFileToOpen())
        {
            djAudioPlayer->stop();
            File result = chooser.getResult();
            djAudioPlayer->loadURL(URL{result});
            waveformDisplay.loadURL(URL{result});
            playlistComponent.create(result);
            String title = "Title: " + playlistComponent.read_record("name", playlistComponent.activeCellRow);
            songTitle.setText(title, dontSendNotification);
        }
    }
    if (button == &loadPlaylistButton)
    {
        if (playlistComponent.rowSelected)
        {
            djAudioPlayer->stop();
            djAudioPlayer->loadURL(URL{playlistComponent.read_record("path", playlistComponent.activeCellRow)});
            waveformDisplay.loadURL(URL{playlistComponent.read_record("path", playlistComponent.activeCellRow)});
            
            String title = "Title: " + playlistComponent.read_record("name", playlistComponent.activeCellRow);
            songTitle.setText(title, dontSendNotification);
        }
    }

}

void DeckGUI::sliderValueChanged(Slider* slider)
{
    if (slider == &gainSlider)
    {
        djAudioPlayer->setGain(slider->getValue());
    }
    if (slider == &posSlider)
    {
        djAudioPlayer->setPositionRelative(slider->getValue());
    }
    if (slider == &speedSlider)
    {
        djAudioPlayer->setSpeed(slider->getValue());
    }
}

bool DeckGUI::isInterestedInFileDrag(const StringArray& files)
{
    return true;
}

void DeckGUI::filesDropped (const StringArray &files, int x, int y)
{
    if (files.size() == 1)
    {
        djAudioPlayer->loadURL(URL{File{files[0]}});
        waveformDisplay.loadURL(URL{File{files[0]}});
    }
}

void DeckGUI::timerCallback()
{
    waveformDisplay.setPositionRelative(djAudioPlayer->getPositionRelative());
    if (djAudioPlayer->getPositionRelative() > 0)
    {
        posSlider.setValue(djAudioPlayer->getPositionRelative());
    }
    repaint();
}

void DeckGUI::cursorCheck()
{
    // Button Cursors
    playButton.setMouseCursor(MouseCursor::PointingHandCursor);
    pauseButton.setMouseCursor(MouseCursor::PointingHandCursor);
    rewindButton.setMouseCursor(MouseCursor::PointingHandCursor);
    forwardButton.setMouseCursor(MouseCursor::PointingHandCursor);
    loadButton.setMouseCursor(MouseCursor::PointingHandCursor);
    loadPlaylistButton.setMouseCursor(MouseCursor::PointingHandCursor);
    stopButton.setMouseCursor(MouseCursor::PointingHandCursor);
    // Slider Cursors
    gainSlider.setMouseCursor(MouseCursor::PointingHandCursor);
    speedSlider.setMouseCursor(MouseCursor::PointingHandCursor);
    posSlider.setMouseCursor(MouseCursor::PointingHandCursor);
    
}

void DeckGUI::rewindCheck()
{
    if (rewindButton.isMouseButtonDown())
    {
        djAudioPlayer->setPosition(djAudioPlayer->getPosition()-0.5);
    }
    
    if (forwardButton.isMouseButtonDown())
    {
        djAudioPlayer->setPosition(djAudioPlayer->getPosition()+0.5);
    }
}

void DeckGUI::playlistLoading()
{    
    if (playlistComponent.loadingDeck1 && getName() == "deckGUI1")
    {
        if (playlistComponent.rowSelected)
        {
            djAudioPlayer->stop();
            djAudioPlayer->loadURL(URL{playlistComponent.read_record("path", playlistComponent.activeCellRow)});
            waveformDisplay.loadURL(URL{playlistComponent.read_record("path", playlistComponent.activeCellRow)});

            String title = "Title: " + playlistComponent.read_record("name", playlistComponent.activeCellRow);
            songTitle.setText(title, dontSendNotification);
            
            playlistComponent.loadingDeck1 = false;
        }
    }
    
    if (playlistComponent.loadingDeck2 && getName() == "deckGUI2")
    {
        if (playlistComponent.rowSelected)
        {
            djAudioPlayer->stop();
            djAudioPlayer->loadURL(URL{playlistComponent.read_record("path", playlistComponent.activeCellRow)});
            waveformDisplay.loadURL(URL{playlistComponent.read_record("path", playlistComponent.activeCellRow)});

            String title = "Title: " + playlistComponent.read_record("name", playlistComponent.activeCellRow);
            songTitle.setText(title, dontSendNotification);
            
            playlistComponent.loadingDeck2 = false;
        }
    }
}

void DeckGUI::hoverColourChanger()
{
    for (int i = 0; i < guiButtons.size(); i++)
    {
        if (guiButtons[i]->isMouseOver())
        {
            guiButtons[i]->setColour(TextButton::ColourIds::buttonColourId, Colours::limegreen);
        }
        else {
            guiButtons[i]->setColour(TextButton::ColourIds::buttonColourId, Colours::grey);
        }
    }
}
