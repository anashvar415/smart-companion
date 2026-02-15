import React, { useState } from 'react';
import { LifeBuoy, X, ChevronRight, FastForward, PlayCircle } from 'lucide-react';

const StuckButton = ({ currentStepText, onSkip }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleImStuck = async () => {
    setLoading(true);
    setIsExpanded(true);
    try {
      const res = await fetch('http://localhost:5000/api/stuck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStepText }),
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsExpanded(false);
    setData(null);
  };

  return (
    <div className="stuck-container">
      <button className="stuck-trigger" onClick={handleImStuck}>
        <LifeBuoy size={16} /> Still too hard? Squeeze it smaller
      </button>

      {isExpanded && (
        <div className="stuck-overlay">
          <div className="stuck-card animate-in">
            <button className="close-stuck" onClick={close}><X size={20}/></button>
            
            {loading ? (
              <div className="stuck-loading">
                <div className="mini-spinner"></div>
                <p>Making it even tinier...</p>
              </div>
            ) : data && (
              <div className="stuck-content">
                <p className="stuck-encouragement">“{data.encouragement}”</p>
                
                <div className="micro-steps">
                  <label>TINY ACTIONS:</label>
                  {data.smallerSteps.map((s, i) => (
                    <div key={i} className="micro-step-item">
                      <ChevronRight size={14} /> {s}
                    </div>
                  ))}
                </div>

                <div className="stuck-actions">
                  <button className="opt-btn continue" onClick={close}>
                    <PlayCircle size={16} /> {data.options[0]}
                  </button>
                  <button className="opt-btn skip" onClick={() => { onSkip(); close(); }}>
                    <FastForward size={16} /> {data.options[1]}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StuckButton;