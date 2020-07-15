import React, { useContext } from 'react';
import HomeMap from './Map/HomeMap'
import HomeMap2 from './Map/HomeMap2'
import CurvedText from './Map/CurvedText'
import '../styles/Home.scss'
import UserContext from '../context/UserContext';


export default function Home() {
    const { userData } = useContext(UserContext);
    return (
        <>
            <div className="homeContainer">
                <div className="wrapper">
                    <CurvedText text="where will you go today?" arc={120} radius={360} />
                    {/* 680px */}
                    {/* <CurvedText text="where will you go today?" arc={90} radius={360} /> */}
                    {/* 501px */}
                    {/* <CurvedText text="where will you go today?" arc={60} radius={360} /> */}
                </div>
                <div className="homeMapContainer">
                    {!userData.token && <HomeMap />}
                    {userData.token && <HomeMap2 />}
                </div>
            </div>
        </>
    )
}
