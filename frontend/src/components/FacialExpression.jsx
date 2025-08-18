import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./facialExpression.css";
import axios from 'axios';

export default function FacialExpression({setSongs}) {
  const videoRef = useRef();

  // Detect faces & expressions
  async function detectMood() {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    let mostProbableExpression = 0;
    let _expression = "";

    if (!detections || detections.length === 0) {
      console.log("No face detected");
      return;
    }

    for (const expression in detections[0].expressions) {
      if (detections[0].expressions[expression] > mostProbableExpression) {
        mostProbableExpression = detections[0].expressions[expression];
        _expression = expression;
      }
    }

    /* get http://localhost:3000/songs?mood= */
    axios.get(`http://localhost:3000/songs?mood=${_expression}`)
    .then(response =>{
      console.log(response.data);
      setSongs(response.data.songs);
    })
  }

  useEffect(() => {
    const MODEL_URL = "/models";

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    };

    loadModels().then(startVideo);
  }, []);

  return (
    <div className="mood-element">
      <video ref={videoRef} autoPlay muted className="user-video-feed" />
      <button onClick={detectMood}>Detect Mood</button>
    </div>
  );
}