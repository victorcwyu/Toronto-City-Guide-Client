import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import "../../styles/Header.scss";

export default function Header() {
    const {userData, setUserData} = useContext(UserContext);
    const history = useHistory();

    const handleLogOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('auth-token');
        setUserData({...userData, token: undefined})
        history.push('/');
    }

    return (
        <nav className="nav-root">
            <div className="navbar">
            {userData.token && 
                <Link className="nav-item" to="/">
                    Home
                </Link>
            }
            {!userData.token && 
                <Link className="nav-item" to="/login">
                    <p>Login</p>
                </Link>
            }
            {!userData.token &&
                <Link className="nav-item" to="/signup">
                    <p>Sign Up</p>
                </Link>        
            }
            {userData.token &&
                <Link className="nav-item" to="/Map">
                    Map
                </Link>
            }
            {userData.token &&
                <Link className="nav-item" to="/schedule">
                    Schedule
                </Link>
            }
            {userData.token &&
                <Link className="nav-item" to="/userProfile">
                    Contacts
                </Link>
            }
            {userData.token &&
                <button className="navButton" onClick={handleLogOut}>Log Out</button>
            }
            <Link className="nav-item" to="/faq">
                FAQ
            </Link>    
        </div>
        </nav>
    )
}
