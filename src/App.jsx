import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { TrailerModalProvider } from './context/TrailerModalContext';
import AppRouter from './router';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TrailerModalProvider>
        <div className="App">
          <AppRouter />
        </div>
      </TrailerModalProvider>
    </AuthProvider>
  );
}

export default App;
