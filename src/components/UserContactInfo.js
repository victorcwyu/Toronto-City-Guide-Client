import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { Card, Button } from '@material-ui/core';
import UserContext from '../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyle = makeStyles({

})

export default function UserContactInfo({contactName, contactId}) {
    const history = useHistory();
    const classes = useStyle();
    const {userData, setUserData} = useContext(UserContext);
    
    const renderMessages = () => {
        const contactID = contactId
        setUserData({...userData, contactId: contactID})
        history.push('/messages');
    }
    
    const handleDelete = async () => {
        console.log(userData)
        const token = localStorage.getItem("auth-token");
        const deleteRes = await axios.delete('http://localhost:5000/removeContact', {
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
        <div>
        <Card>
            <h1>{contactName}</h1> 
            <p>{contactId}</p>
            <Button
                id="contactId" 
                value={contactId}
                variant="contained"
                onClick={renderMessages}
            >
                Messages
            </Button>
            <Button 
                variant="contained"
                onClick={handleDelete}
            >
            Remove
            </Button>
        </Card> 
        </div>
    )
}
