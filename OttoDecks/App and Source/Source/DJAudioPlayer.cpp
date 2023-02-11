#include "DJAudioPlayer.h"

DJAudioPlayer::DJAudioPlayer(AudioFormatManager& _formatManager) 
: formatManager(_formatManager)
{
}

DJAudioPlayer::~DJAudioPlayer()
{
    
}

void DJAudioPlayer::loadURL(URL audioURL)
{
    auto* reader = this->formatManager.createReaderFor(audioURL.createInputStream(URL::InputStreamOptions{ URL::ParameterHandling::inAddress }));
    if (reader != nullptr) // good file!
    {
        std::unique_ptr<AudioFormatReaderSource> newSource (new AudioFormatReaderSource(reader, true));
        transportSource.setSource (newSource.get(), 0, nullptr, reader->sampleRate);
        readerSource.reset (newSource.release());
        isLoaded = true;
    }
    songLength = reader->lengthInSamples/reader->sampleRate;
}

void DJAudioPlayer::play()
{
    if (!isPaused)
    {
        transportSource.start();
        isPlaying = true;
    }
    else if (isPaused)
    {
        setPosition(pausePosition);
        transportSource.setPosition(pauseTime);
        transportSource.start();
        isPlaying = true;
        isPaused = false;
    }
}

void DJAudioPlayer::pause()
{
    if (isPlaying && isLoaded)
    {
        isPaused = true;
        pauseTime = transportSource.getCurrentPosition();
        pausePosition = getPositionRelative();
        transportSource.stop();
    }
}

void DJAudioPlayer::stop()
{
    isPlaying = false;
    isPaused = false;
    transportSource.stop();
    transportSource.setPosition(0);
    setPositionRelative(0);
}

void DJAudioPlayer::setPosition(double posInSecs)
{
    if (posInSecs < 0 || posInSecs > transportSource.getLengthInSeconds())
    {
        DBG("DJAudioPlayer::setPosition: warning set position " << posInSecs << "greater than length " << transportSource.getLengthInSeconds() );
        return;
    }
    transportSource.setPosition(posInSecs);
}

double DJAudioPlayer::getPosition()
{
    return transportSource.getCurrentPosition();
}

void DJAudioPlayer::setGain(double gain)
{
    if (gain < 0 || gain > 1)
    {
        std::cout << "DJAudioPlayer::setGain should be between 0 and 1" << std::endl;
    }
    
    else {
        transportSource.setGain(gain);
    }
}

void DJAudioPlayer::setSpeed(double ratio)
{
    if (ratio < 0.1 || ratio > 100.0)
    {
        std::cout << "DJAudioPlayer::setSpeed should be between 0 and 10" << std::endl;
    }
    else {
        resampleSource.setResamplingRatio(ratio);
    }
}

void DJAudioPlayer::prepareToPlay (int samplesPerBlockExpected, double sampleRate)
{
    transportSource.prepareToPlay (samplesPerBlockExpected, sampleRate);
    resampleSource.prepareToPlay(samplesPerBlockExpected, sampleRate);
}

void DJAudioPlayer::getNextAudioBlock (const AudioSourceChannelInfo& bufferToFill)
{
    if (readerSource.get() == nullptr)
    {
        bufferToFill.clearActiveBufferRegion();
        return;
    }
    resampleSource.getNextAudioBlock (bufferToFill);
}

void DJAudioPlayer::releaseResources()
{
    transportSource.releaseResources();
    resampleSource.releaseResources();
}

void DJAudioPlayer::setPositionRelative(double pos)
{
    if (pos < 0 || pos > 1)
    {
        std::cout << "DJAudioPlayer::setPositionRelative should be between 0 and 1" << std::endl;
    }
    else {
        double posInSecs = pos * transportSource.getLengthInSeconds();
        setPosition(posInSecs);
        pauseTime = posInSecs;
    }
}

double DJAudioPlayer::getPositionRelative()
{
    return transportSource.getCurrentPosition() / transportSource.getLengthInSeconds();
}
