import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { Card, Button } from '@material-ui/core';
import UserContext from '../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyle = makeStyles({
    button: {
        color: "#01050e",
        margin: "0 1rem 1rem 0",
        marginLeft: "1rem"
    },
    card: {
        marginBottom: "1.5rem",
        backgroundColor: "#287ac3",
        boxShadow: "10px 10px 5px 0px rgba(0, 0, 0, 0.75)",
        padding: "0.5rem"
    }
})

export default function UserContactInfo({contactName, contactId}) {
    const history = useHistory();
    const classes = useStyle();
    const {userData, setUserData} = useContext(UserContext);
    
    const renderMessages = () => {
        const contactID = contactId
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
            setUserData({...userData.user, contacts: newContacts})
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
