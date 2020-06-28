import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { Card, Button } from '@material-ui/core';
import UserContext from '../context/UserContext';


export default function UserContactInfo({contactName, contactId}) {
    const history = useHistory();
    const {userData, setUserData} = useContext(UserContext);
    
    const renderMessages = () => {
        const contactID = contactId
        setUserData({...userData, contactId: contactID})
        history.push('/messages');
    }

    
    const handleDelete = e => {
        e.preventDefault()
        console.log('yes')
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
                onclick={handleDelete}
            >
            Remove
            </Button>
        </Card> 
        </div>
    )
}
