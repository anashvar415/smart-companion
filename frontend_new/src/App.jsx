import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Settings, X, Loader2, CheckCircle } from 'lucide-react';

// Context & Utils
import { useProfile } from './ProfileContext';
import { updateStreak, getStreakBadge } from './streakUtils';
import { speak, stopSpeaking } from './speechUtils';

// Components
import StuckButton from './components/StuckButton';
import MicroTimer from './components/MicroTimer';
import VoiceInput from './components/VoiceInput';

import './style.css';
import './mic.css';
import './stuckbutton.css';

const App = () => {
  // --- 1. GLOBAL PROFILE CONTEXT ---
  const { profile, updateProfile } = useProfile();

  // --- 2. LOCAL APP STATE ---
  const [taskInput, setTaskInput] = useState("");
  const [steps, setSteps] = useState([]); 
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isThinking, setIsThinking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('streak_data');
    return saved ? JSON.parse(saved) : { count: 0, lastDate: null };
  });

  // --- 3. SPEECH FEEDBACK LOOP ---
  useEffect(() => {
    // Automatically read the step when it changes
    if (currentStepIndex !== -1 && steps[currentStepIndex]) {
      const speechRate = profile.energyLevel === 'low' ? 0.8 : 1.0;
      speak(steps[currentStepIndex].step, speechRate);
    }
    
    // Cleanup speech when component unmounts or index changes
    return () => stopSpeaking();
  }, [currentStepIndex, steps, profile.energyLevel]);

  // --- 4. API LOGIC (Gemini) ---
  const handleBreakdown = async (voiceText) => {
    const finalTask = voiceText || taskInput;
    if (!finalTask) return;
    
    setIsThinking(true);
    try {
      const response = await fetch('http://localhost:5000/api/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: finalTask, 
          prefs: profile 
        }),
      });

      if (!response.ok) throw new Error("Backend not responding");
      
      const data = await response.json();
      setSteps(data.steps || data); 
      setCurrentStepIndex(0);
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Ensure your Node.js server is running on port 5000!");
    } finally {
      setIsThinking(false);
    }
  };

  // --- 5. PROGRESS & NAVIGATION ---
  const handleDone = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // TASK COMPLETE
      const updatedStreak = updateStreak();
      setStreakData(updatedStreak);
      
      setCurrentStepIndex(-1);
      setSteps([]);
      setTaskInput("");
    }
  };

  const activeBadge = getStreakBadge(streakData.count);

  return (
    <div className={`app-shell ${profile.energyLevel === 'low' ? 'calm-theme' : ''}`}>
      
      {/* NAVIGATION BAR */}
      <nav className="glass-nav">
        <div className="logo"><Zap size={22} fill="currentColor"/> SmartCompanion</div>
        
        <div className="nav-actions">
          {activeBadge && (
            <span className="streak-badge-label animate-in" style={{ backgroundColor: activeBadge.color }}>
              {activeBadge.label}
            </span>
          )}
          
          <div className="streak-counter">🔥 {streakData.count}</div>
          
          <button className="icon-btn" onClick={() => setShowSettings(true)}>
            <Settings size={22} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        
        {/* SCREEN 1: GOAL ENTRY */}
        {currentStepIndex === -1 && !isThinking && (
          <div className="hero-card float">
            <Sparkles style={{color: '#f59e0b', marginBottom: '1rem'}} size={32} />
            <h1 className="hero-title">What are we <br/>doing today?</h1>
            <p className="hero-subtitle">Your personalized coach for big goals.</p>
            
            <div className="input-wrapper">
              <input 
                className="stylish-input"
                placeholder="e.g. Prep for the interview..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
              />
              <VoiceInput 
                onTranscriptionComplete={(text) => handleBreakdown(text)}
                isProcessing={isThinking}
              />
            </div>
            
            <button className="btn-glow" onClick={() => handleBreakdown()} disabled={!taskInput}>
              Break it Down <Sparkles size={18} />
            </button>
          </div>
        )}

        {/* SCREEN 2: LOADING */}
        {isThinking && (
          <div className="hero-card">
            <div className="spinner-wrapper">
              <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
            <h2 className="animate-pulse" style={{marginTop: '1.5rem'}}>Tailoring steps for your energy...</h2>
          </div>
        )}

        {/* SCREEN 3: FOCUS MODE (One step at a time) */}
        {currentStepIndex !== -1 && steps.length > 0 && (
          <div className="step-container animate-in">
            <div className="visual-progress">
              <div 
                className="bar-fill" 
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            
            <div className="hero-card step-card-active">
              <div className="step-badge">
                <span className="step-number">{currentStepIndex + 1}</span>
                <span className="step-divider">of</span>
                <span className="step-total">{steps.length}</span>
              </div>

              <h2 className="step-heading">{steps[currentStepIndex].step}</h2>
              
              <div className="focus-zone">
                <MicroTimer 
                  duration={steps[currentStepIndex].time} 
                  key={currentStepIndex} 
                />
              </div>
            </div>

            <button className="btn-glow btn-success bounce-in" onClick={handleDone} style={{marginTop: '2rem'}}>
              <CheckCircle size={28} /> I DID IT
            </button>
            
            <div className="help-text-footer">
              <StuckButton 
                currentStepText={steps[currentStepIndex].step} 
                onSkip={handleDone} 
              />
            </div>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="settings-modal animate-in">
            <div className="modal-header">
              <h3 style={{fontWeight: 900}}>Neuro-Profile</h3>
              <button className="icon-btn" onClick={() => setShowSettings(false)}><X /></button>
            </div>
            
            <div className="settings-list">
              <div className="setting-item">
                <label>Energy Level</label>
                <select 
                  className="stylish-select"
                  value={profile.energyLevel} 
                  onChange={(e) => updateProfile({ energyLevel: e.target.value })}
                >
                  <option value="low">Low (Tiny Tasks)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Big Wins)</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Dyslexia Friendly</label>
                <input 
                  type="checkbox" 
                  checked={profile.dyslexiaMode} 
                  onChange={() => updateProfile({ dyslexiaMode: !profile.dyslexiaMode })} 
                />
              </div>

              <div className="setting-item">
                <label>Motivation Style</label>
                <select 
                  className="stylish-select"
                  value={profile.motivationStyle} 
                  onChange={(e) => updateProfile({ motivationStyle: e.target.value })}
                >
                  <option value="supportive">Warm & Supportive</option>
                  <option value="direct">Direct & Concise</option>
                  <option value="gamified">Fun & Gamified</option>
                </select>
              </div>
            </div>
            <p className="privacy-note">Privacy: All profile data stays on your local device.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;