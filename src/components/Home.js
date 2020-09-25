import React, { useState, useEffect } from 'react';
import UserMap from './Map/UserMap'
import CurvedText from './Map/CurvedText'
import '../styles/Home.scss'

export default function Home() {

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
                    {(windowWidth < 680 && windowWidth >= 500) &&
                        <CurvedText text="where will you go today?" arc={90} radius={360} />
                    }
                    {(windowWidth < 500 && windowWidth >= 451) &&
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
                    <UserMap home={true} />
                </div>
            </div>
        </>
    )
}
