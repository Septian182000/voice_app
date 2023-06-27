import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { Row, Col, Container } from "react-bootstrap";

function App2() {
  const [voice, setVoice] = useState({});
  const [isRecording, setIsRecording] = useState(false); // Add state for tracking recording status

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    console.log(audio);
    audio.src = url;
    audio.controls = true;
    setVoice({ ...voice, link: url });
  };

  const startRecording = () => {
    setIsRecording(true);
    recorderControls.startRecording();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorderControls.stopRecording();
  };

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err)
  );

  return (
    <Container>
      <Row style={{ justifyContent: "center" }}>
        <Row className="justify-content-center mt-5">
          <Col lg={"auto"}>
            <AudioRecorder
              onRecordingComplete={(blob) => addAudioElement(blob)}
              recorderControls={recorderControls}
              showVisualizer={true}
            />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={"auto"}>
            <br />
            {isRecording ? (
              <button onClick={stopRecording}>Stop Recording</button>
            ) : (
              <button onClick={startRecording}>Start Recording</button>
            )}
            <br />
          </Col>
        </Row>
      </Row>
      {voice.link && (
        <Row className="justify-content-center mt-3">
          <Col lg={"auto"}>
            <audio src={voice.link} controls autoPlay />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App2;
