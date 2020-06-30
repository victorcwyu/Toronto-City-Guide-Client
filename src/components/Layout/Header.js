import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        background: '#444',
        height: '60px',
        marginBottom: "3rem"
    },
    navbar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navItem: {
        color: "#fff",
        textDecoration: 'none',
        margin: '5px 5px 0 5px'
    },
    navButton: {
        border: "none",
        backgroundColor: '#444',
        color: '#fff',
        cursor: 'pointer'
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

            <Link className={classes.navItem} to="/">
                Home
            </Link>
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
            <Link className={classes.navItem} to="/userProfile">
             User Profile
            </Link>
        }
        {userData.token &&
            <button className={classes.navButton} onClick={handleLogOut}>Log Out</button>
        }
        </div>
        </nav>
    )
}
