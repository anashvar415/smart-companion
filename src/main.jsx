
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ProfileProvider } from './ProfileContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ProfileProvider>
    <App />
  </ProfileProvider>
);