import React, { useContext, useState, useEffect } from 'react';
import HomeMap from './Map/HomeMap'
import HomeMap2 from './Map/HomeMap2'
import CurvedText from './Map/CurvedText'
import '../styles/Home.scss'
import UserContext from '../context/UserContext';


export default function Home() {
    const { userData } = useContext(UserContext);

    const [windowWidth, setWindowWidth] = useState('');
    
    useEffect(() => {
        setWindowWidth(window.innerWidth);
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    }, []);

    return (
        <>
            <div className="homeContainer">
                <div className="wrapper">
                    {windowWidth >= 680 &&
                        <CurvedText text="where will you go today?" arc={120} radius={360} />
                    }
                    {(windowWidth < 680 && windowWidth >= 501) &&
                        <CurvedText text="where will you go today?" arc={90} radius={360} />
                    }
                    {(windowWidth < 501 && windowWidth >= 451) &&
                        <CurvedText text="where will you go today?" arc={80} radius={360} />
                    }   
                    {(windowWidth < 451 && windowWidth >= 375) &&
                        <CurvedText text="where will you go today?" arc={60} radius={360} />
                    }   
                    {(windowWidth < 375) &&
                        <CurvedText text="where will you go today?" arc={50} radius={360} />
                    }   
                </div>
                <div className="homeMapContainer">
                    {!userData.token && <HomeMap />}
                    {userData.token && <HomeMap2 />}
                </div>
            </div>
        </>
    )
}
