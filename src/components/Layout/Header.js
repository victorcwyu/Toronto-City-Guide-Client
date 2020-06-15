import React from 'react';
import {Link} from 'react-router-dom';

export default function Header() {
    return (
        <nav>
            <Link to="/login">
                <p>Login</p>
            </Link>
            <Link to="/signup">
            Sign Up
            </Link>
            
        </nav>
    )
}
