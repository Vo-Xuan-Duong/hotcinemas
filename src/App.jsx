import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import { AuthProvider } from './context/AuthContext';
import { TrailerModalProvider } from './context/TrailerModalContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TrailerModalProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <Home />
          </main>
          <Footer />
        </div>
      </TrailerModalProvider>
    </AuthProvider>
  );
}

export default App;
