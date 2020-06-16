import React from 'react';
import './App.css';
import Signup from './components/auth/signup';
import Schedule from './components/Schedule';
// import Map from './components/Map';
import SearchAndMap from './components/SearchAndMap';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
      </header> */}
      <Signup />
      {/* <Map /> */}
      <Schedule/>
      <SearchAndMap />
    </div>
  );
}

export default App;
