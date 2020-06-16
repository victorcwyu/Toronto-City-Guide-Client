import React from 'react';
import {Link} from 'react-router-dom';
import '../../App.css'

export default function Header() {
    return (
        <nav className="navbar">
            <Link to="/">
                Home
            </Link>
            <Link to="/login">
                <p>Login</p>
            </Link>
            <Link to="/signup">
            Sign Up
            </Link>
        </nav>
    )
}
