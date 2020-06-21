import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import '../../App.css'

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
        <nav className="navbar">
            <Link to="/">
                Home
            </Link>
            <Link to="/userProfile">
             User Profile
            </Link>
        {!userData.token && 
        <div>
            <Link to="/login">
                <p>Login</p>
            </Link>
            <Link to="/signup">
                <p>Sign Up</p>
            </Link>
        </div>
        }
        {userData.token &&
        <div>
            <button onClick={handleLogOut}>Log Out</button>
        </div>

        }
        </nav>
    )
}
