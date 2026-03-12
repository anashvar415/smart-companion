
let currentUtterance = null;

/**
 * Reads text aloud with customizable speed.
 * @param {string} text - The instruction to read.
 * @param {number} rate - The speed of speech (0.1 to 10, default 1.0).
 */
export const speak = (text, rate = 1.0) => {
  // 1. Cancel any current speech immediately
  window.speechSynthesis.cancel();

  if (!text) return;

  // 2. Create the speech object
  const utterance = new SpeechSynthesisUtterance(text);
  
  // 3. Configure voice and properties
  utterance.rate = rate; 
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';

  // 4. Optional: Select a specific voice if available
  const voices = window.speechSynthesis.getVoices();
  // We prefer natural-sounding Google voices or specific US English ones
  const preferredVoice = voices.find(v => 
    v.name.includes('Google') || v.name.includes('Natural') || v.lang === 'en-US'
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  currentUtterance = utterance;

  // 5. Execute the speech
  window.speechSynthesis.speak(utterance);
};

/**
 * Stops all ongoing speech immediately.
 */
export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};

/**
 * Checks if the browser supports speech synthesis.
 * @returns {boolean}
 */
export const isSpeechSupported = () => {
  return 'speechSynthesis' in window;
};