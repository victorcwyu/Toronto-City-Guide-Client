import React from 'react';
import './App.css';
import Signup from './components/auth/signup';
import Schedule from './components/Schedule';
import Login from './components/auth/login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Signup />
      <Login />
      <Schedule/>
    </div>
  );
}

export default App;
