import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertTriangle, Loader2 } from 'lucide-react';

const VoiceInput = ({ onTranscriptionComplete, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one phrase
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onTranscriptionComplete(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [onTranscriptionComplete]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null);
      recognitionRef.current?.start();
    }
  };

  if (error && !isListening) {
    return (
      <div className="voice-error-tooltip">
        <AlertTriangle size={14} /> {error}
      </div>
    );
  }

  return (
    <div className="voice-input-container">
      <button 
        type="button"
        onClick={toggleListening}
        className={`voice-btn ${isListening ? 'listening' : ''} ${isProcessing ? 'disabled' : ''}`}
        disabled={isProcessing}
        title={isListening ? "Stop Listening" : "Start Voice Input"}
      >
        {isProcessing ? (
          <Loader2 className="animate-spin" size={20} />
        ) : isListening ? (
          <MicOff size={20} />
        ) : (
          <Mic size={20} />
        )}
      </button>
      
      {isListening && (
        <div className="listening-indicator">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <p>Listening...</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;