import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { Button } from '@material-ui/core';
import UserContext from '../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyle = makeStyles({
    // button: {
    //     // color: "#01050e",
    //     // margin: "0 1rem 1rem 0",
    //     // marginLeft: "1rem"
    // },
    button: {
        margin: "0 1rem",
        border: 'none',
        // color: "#01050e",
        // color: "#01050e",
        color: "white",
        // marginTop: "0.5rem",
        textTransform: "none",
        backgroundColor: '#1a2656',
        cursor: 'pointer',
        '&:hover': {
            color: '#0f508b',
            backgroundColor: 'white',
        },
    },
    card: {
        margin: "0 auto 1.5rem",
        backgroundColor: "#287ac3",
        boxShadow: "10px 10px 5px 0px rgba(0, 0, 0, 0.75)",
        padding: "0.5rem",
        width: '80%'
    }
})

export default function UserContactInfo({contactName, contactId}) {
    const history = useHistory();
    const classes = useStyle();
    const {userData, setUserData} = useContext(UserContext);
    
    const renderMessages = () => {
        // const contactID = contactId
        setUserData({...userData, contactInfo: {contactId, contactName}})
        history.push('/messages');
    }
    
    const handleDelete = async () => {
        console.log(userData)
        const token = localStorage.getItem("auth-token");
        const deleteRes = await axios.delete('https://toronto-city-travel-guide.herokuapp.com/removeContact', {
            headers : { "x-auth-token": token },
            data: { contactId } 
        })
        if(deleteRes.status === 200){
            const {newContacts} = deleteRes.data;
            const newUserData = { ...userData.user, contacts: newContacts };
            setUserData({...userData, user: newUserData})
        } else {
            console.log('handle error');
        }
      }

    return (
        <div className={classes.card}>
            <h1>{contactName}</h1> 
            <Button
                id="contactId" 
                value={contactId}
                variant="outlined"
                onClick={renderMessages}
                className={classes.button}
            >
                Messages
            </Button>
            <Button 
                variant="outlined"
                onClick={handleDelete}
                className={classes.button}
            >
            Remove
            </Button>

        </div>
    )
}
