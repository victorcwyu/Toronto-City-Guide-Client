import React from 'react';
import {useHistory} from 'react-router-dom';
import { Card, Button } from '@material-ui/core';

export default function UserContactInfo(props) {
    const {contactName} = props;
    const history = useHistory();

    const renderMessages = (e) => {
        e.preventDefault();
        history.push('/messages');
    }

    return (
        <div>
        <Card>
            <h1>{contactName}</h1> 
            <Button variant="contained" onClick={renderMessages}>Message</Button>
            <Button variant="contained">Remove</Button>
        </Card> 
        </div>
    )
}
