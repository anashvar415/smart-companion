import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Pause, AlertCircle } from 'lucide-react';

const MicroTimer = ({ duration }) => {
  const totalSeconds = duration * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // SVG Circle Constants
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setSecondsLeft(totalSeconds);
    setIsActive(false);
    setIsFinished(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="micro-timer-container">
      <div className="timer-visual">
        <svg width="120" height="120" viewBox="0 0 110 110">
          {/* Background Circle */}
          <circle
            cx="55" cy="55" r={radius}
            stroke="#e2e8f0" strokeWidth="8" fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="55" cy="55" r={radius}
            stroke="var(--primary)" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset, 
              transition: 'stroke-dashoffset 1s linear',
              strokeLinecap: 'round'
            }}
            transform="rotate(-90 55 55)"
          />
        </svg>
        <div className="timer-text">{formatTime(secondsLeft)}</div>
      </div>

      <div className="timer-controls">
        {!isFinished ? (
          <>
            <button onClick={toggleTimer} className="timer-btn main">
              {isActive ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={resetTimer} className="timer-btn reset">
              <RotateCcw size={18} />
            </button>
          </>
        ) : (
          <div className="timer-alert animate-in">
            <div className="alert-content">
              <AlertCircle size={16} />
              <span>Time is up!</span>
            </div>
            <button onClick={resetTimer} className="timer-retry-btn">Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroTimer;