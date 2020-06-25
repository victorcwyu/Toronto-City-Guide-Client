import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { Card, Button } from '@material-ui/core';
import UserContext from '../context/UserContext';


export default function UserContactInfo(props) {
    const {contactName, contactId} = props;
    const history = useHistory();
    const {userData, setUserData} = useContext(UserContext);
    
    const renderMessages = () => {
        const contactID = contactId
        setUserData({...userData, contactId: contactID})
        history.push('/messages');
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
            <Button variant="contained">Remove</Button>
        </Card> 
        </div>
    )
}
