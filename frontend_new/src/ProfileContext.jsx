import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      energyLevel: 'medium', 
      prefersVoice: false,
      dyslexiaMode: false,
      maxStepsVisible: 5,
      motivationStyle: 'supportive' 
    };
  });

  // Sync with localStorage and DOM on every change
  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    
    // Global Dyslexia Toggle
    if (profile.dyslexiaMode) {
      document.body.classList.add('dyslexic-mode');
    } else {
      document.body.classList.remove('dyslexic-mode');
    }
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};