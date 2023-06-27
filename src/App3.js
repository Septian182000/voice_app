import React, { useEffect, useState, useRef } from "react";
import SimplePeer from "simple-peer";
import Peer from "peerjs";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

function App3() {
  useEffect(() => {
    let mediaStream = null;
    let audioContext = null;
    let audioSource = null;

    const handleSuccess = (stream) => {
      mediaStream = stream;
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioSource = audioContext.createMediaStreamSource(mediaStream);
      audioSource.connect(audioContext.destination);

      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptProcessor.onaudioprocess = (event) => {
        const audioData = event.inputBuffer.getChannelData(0);
        // console.log(audioData); // Print audio data to the console
      };

      audioSource.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
    };

    const handleError = (error) => {
      console.error("Error accessing microphone:", error);
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(handleSuccess)
      .catch(handleError);

    // Cleanup function
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return <div>Open the browser console to see the audio data</div>;
}

export default App3;
