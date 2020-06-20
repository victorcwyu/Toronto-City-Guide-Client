import React from 'react'
import { Card } from '@material-ui/core'

export default function UserContactInfo({contactName}) {
    return (
        <div>
        <Card>
            <h1>{contactName}</h1>       
        </Card> 
        </div>
    )
}
