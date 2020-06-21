import React from 'react'
import Map from './Map';
import Schedule from './Schedule/index';

export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <Schedule />
            <Map />
            
        </div>
    )
}
