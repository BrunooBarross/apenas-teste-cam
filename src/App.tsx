import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';


const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const canvas = webcamRef.current?.getCanvas();
    if (canvas) {
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
    } else {
      console.error('Elemento canvas não encontrado.');
    }
  };

  const handleReadText = async () => {
    if (image) {
      Tesseract.recognize(
        image,
        'por', // Língua do reconhecimento (Português)
        { logger: (m) => console.log(m) } // Logger opcional para ver o progresso
      ).then(({ data: { text } }) => {
        setText(text);
      });
    }
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        width={400}
        height={300}
        screenshotFormat="image/png"
      />
      <button onClick={handleCapture}>Capturar foto</button>
      {image && <button onClick={handleReadText}>Ler texto</button>}
      {text && <p>{text}</p>}
    </div>
  );
};

export default App;
