import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#444',
        height: '75px',
        marginBottom: "3rem",
        boxShadow: '0 2px 6px 6px #1a2656',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navItem: {
        fontSize: "24px", 
        color: "#fff",
        textDecoration: 'none',
        margin: '0 20px',
        "&:hover": {
            color: "#14a2f4"
        }
    },
    navButton: {
        fontFamily: "Roboto, sans-serif",
        fontSize: "24px", 
        margin: '0 25px',
        padding: "0",
        border: "none",
        backgroundColor: '#444',
        color: '#fff',
        cursor: 'pointer',
        "&:hover": {
            color: "#14a2f4"
        }
    }
})


export default function Header() {
    const classes = useStyles();
    const {userData, setUserData} = useContext(UserContext);
    const history = useHistory();

    const handleLogOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('auth-token');
        setUserData({...userData, token: undefined})
        history.push('/');
    }

    return (
        <nav className={classes.root}>
            <div className={classes.navbar}>
            {userData.token && 
                <Link className={classes.navItem} to="/">
                    Home
                </Link>
            }
        {!userData.token && 
            <Link className={classes.navItem} to="/login">
                <p>Login</p>
            </Link>
        }
        {!userData.token &&
            <Link className={classes.navItem} to="/signup">
                <p>Sign Up</p>
            </Link>        
        }
        {userData.token &&
            <Link className={classes.navItem} to="/Map">
             Map
            </Link>
        }
        {userData.token &&
            <Link className={classes.navItem}
            to="/schedule">
                Schedule
            </Link>
        }
        {userData.token &&
            <Link className={classes.navItem} to="/userProfile">
             {/* User Profile */}
             Contacts
            </Link>
        }
        {userData.token &&
            <button className={classes.navButton} onClick={handleLogOut}>Log Out</button>
        }
        </div>
        </nav>
    )
}
