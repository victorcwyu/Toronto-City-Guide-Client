import React from 'react'
import HomeMap from './HomeMap';
import Schedule from './Schedule/index';

export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <HomeMap />
            <Schedule />
        </div>
    )
}
