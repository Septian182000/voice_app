import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState, useRef } from "react";

function App() {
  const [audioStream, setAudioStream] = useState(null);
  const audioRef = useRef(null);
  const analyserNode = useRef(null);
  const audioContext = useRef(null);

  const handleStartStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
  };

  const handleStopStreaming = () => {
    audioStream.getTracks().forEach((track) => track.stop());
    setAudioStream(null);
  };

  const handleAudioAnalysis = () => {
    const bufferSize = 32;
    const sampleRate = audioContext.current.sampleRate;
    const audioBuffer = new Float32Array(bufferSize);

    analyserNode.current.fftSize = bufferSize;
    analyserNode.current.smoothingTimeConstant = 1;

    const processAudio = () => {
      analyserNode.current.getFloatTimeDomainData(audioBuffer);
      const voiceDetected = isVoiceDetected(audioBuffer);
      if (voiceDetected) {
        const spokenText = extractSpokenWords(audioBuffer, sampleRate);
        console.log(spokenText);
      }
      requestAnimationFrame(processAudio);
    };

    processAudio();
  };

  const isVoiceDetected = (audioBuffer) => {
    const energyThreshold = 0.01; // Adjust threshold according to your needs
    const energy =
      audioBuffer.reduce((sum, sample) => sum + sample ** 2, 0) /
      audioBuffer.length;
    return energy > energyThreshold;
  };

  const extractSpokenWords = (audioBuffer, sampleRate) => {
    const spokenText = audioBuffer.join(" ");
    return spokenText;
  };

  useEffect(() => {
    if (audioStream) {
      audioContext.current = new (window.AudioContext || window.AudioContext)();
      const audioSource =
        audioContext.current.createMediaStreamSource(audioStream);
      analyserNode.current = audioContext.current.createAnalyser();
      audioSource.connect(analyserNode.current);
      audioRef.current.srcObject = audioStream;
      handleAudioAnalysis();
    }
  }, [audioStream]);

  return (
    <div>
      {audioStream ? (
        <div>
          <button onClick={handleStopStreaming}>Stop Streaming</button>
          <audio ref={audioRef} autoPlay muted />
        </div>
      ) : (
        <button onClick={handleStartStreaming}>Start Streaming</button>
      )}
    </div>
  );
}

export default App;
