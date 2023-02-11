#include <JuceHeader.h>
#include "WaveformDisplay.h"

//==============================================================================
WaveformDisplay::WaveformDisplay(AudioFormatManager & formatManagerToUse,
                                 AudioThumbnailCache & cacheToUse) :
                                    fileLoaded(false),
                                    audioThumbnail(1000, formatManagerToUse, cacheToUse),
                                    position(0)
{
    audioThumbnail.addChangeListener(this);
}

WaveformDisplay::~WaveformDisplay()
{
    
}

void WaveformDisplay::paint (Graphics& g)
{
    g.fillAll (Colours::purple);
    g.setColour (Colours::grey);
    g.drawRect (getLocalBounds(), 1);
    g.setColour (Colours::red);
    if(fileLoaded)
    {
        audioThumbnail.drawChannel(g, getLocalBounds(), 0, audioThumbnail.getTotalLength(), 0, 1.0f);
        g.setColour(Colours::lightgreen);
        g.drawVerticalLine(position * getWidth(), 0, getHeight());
    }
    else
    {
        g.setFont (20.0f);
        g.drawText ("File not loaded...", getLocalBounds(),
                    Justification::centred, true); // draw some placeholder text
    }
}

void WaveformDisplay::loadURL(URL audioURL)
{
    audioThumbnail.clear();
    fileLoaded = audioThumbnail.setSource(new URLInputSource(audioURL));
    if (fileLoaded)
    {
        repaint();
    }
    else {
        std::cout << "Waveform failed to load..." << std::endl;
    }
}

void WaveformDisplay::changeListenerCallback(ChangeBroadcaster *source)
{
    repaint();
}

void WaveformDisplay::setPositionRelative(double pos)
{
    if (pos != position && pos >= 0)
    {
        position = pos;
        repaint();
    }
}

void WaveformDisplay::mouseDown(const MouseEvent &event)
{
    if (fileLoaded)
    {
        Point <int> newPos = getMouseXYRelative();
        newX = newPos.getX();
        newX = newX/getWidth();
        setPositionRelative(newX);
        isDown = true;
        repaint();
    }
}

void WaveformDisplay::mouseUp(const MouseEvent &event)
{
    isDown = false;
}

void WaveformDisplay::mouseDrag(const MouseEvent &event)
{
    if (fileLoaded)
    {
        Point <int> newPos = getMouseXYRelative();
        newX = newPos.getX();
        newX = newX/getWidth();
        setPositionRelative(newX);
        isDown = true;
        repaint();
    }
}

void WaveformDisplay::mouseEnter(const MouseEvent &event)
{
    if (fileLoaded)
    {
        setMouseCursor(MouseCursor::PointingHandCursor);
    }
}
