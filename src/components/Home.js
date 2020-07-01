import React from 'react'
// import HomeMap from './Map/HomeMap'
// import FavouritesHomeMap from './Map/FavouritesHomeMap'
import HomeMap2 from './Map/HomeMap2'
import CurvedText from './Map/CurvedText'
import '../styles/CurvedText.scss'


export default function Home() {
    return (
        <>
            <div className="wrapper">
                <CurvedText text="where will you go today?" arc={120} radius={360} />
            </div>
            <div className="homeContainer">
                <HomeMap2 />
            </div>
        </>
    )
}
