import React from 'react'
import { Card, Button } from '@material-ui/core'

export default function UserContactInfo(props) {
    const {contactName} = props;
    return (
        <div>
        <Card>
            <h1>{contactName}</h1> 
            <Button variant="contained">Message</Button>
            <Button variant="contained">Remove</Button>
        </Card> 
        </div>
    )
}
