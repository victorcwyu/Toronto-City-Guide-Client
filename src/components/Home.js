import React from 'react';
import '../styles/Home.scss';
import Signup from '../components/auth/signup';
import Schedule from '../components/Schedule';
import Map from '../components/Map';


export default function Home() {
  return (
    <div className="App">
      {/* <header className="App-header">
      </header> */}
      <Signup />
      <Map />
      <Schedule/>
    </div>
  ); 
  }