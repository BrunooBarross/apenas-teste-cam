import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: { exact: "environment" } // Utiliza a câmera traseira em dispositivos móveis
};

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isReading, setIsReading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    const canvas = webcamRef.current?.getCanvas();
    if (canvas) {
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      setIsReading(false); // Habilita o botão "Ler texto" após capturar a foto
    } else {
      console.error('Elemento canvas não encontrado.');
    }
  };

  const handleReadText = async () => {
    if (image) {
      setIsReading(true); // Desabilita o botão "Ler texto" enquanto lê o texto
      Tesseract.recognize(
        image,
        'por', // Língua do reconhecimento (Português)
        { logger: (m) => console.log(m) } // Logger opcional para ver o progresso
      ).then(({ data: { text } }) => {
        setText(text);
        setIsReading(false); // Reabilita o botão após a leitura do texto
      });
    }
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        videoConstraints={videoConstraints}
        width="100%" // Ajusta a largura para 100%
        height="auto" // Ajusta a altura automaticamente
        screenshotFormat="image/png"
      />
      <button onClick={handleCapture}>Capturar foto</button>
      {image && (
        <button onClick={handleReadText} disabled={isReading}>
          Ler texto
        </button>
      )}
      {text && <p>{text}</p>}
    </div>
  );
};

export default App;
