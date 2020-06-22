import React, {useEffect, useContext} from 'react';
import io from 'socket.io-client';
import UserContext from '../context/UserContext';

const ENDPOINT = process.env.ENDPOINT || 5000;

const Messages = (props) => {
    const {contactId} = props;
    const {userData, setUserData} = useContext(UserContext);
    console.log('Contact ID: ', userData.contactId);
    console.log('User ID: ', userData.user.id)
   
    let socket;
    console.log('USERDATA: ', userData)

   useEffect(() => {
       socket = io('http://localhost:5000');
       socket.emit('userData', {
           userId: userData.user.id,
           contactId: userData.contactId
       })
       return () => socket.disconnect();
   }, []) 
 
    return (
        <div>
            <h1>Messages</h1>
        </div>
    )
}

export default Messages;

// We can user a message context and dthen we can check the context 
// We can recieve and emit from App.js and then use the message page to update the message page.

// update message state so it shows right away if both are logged in.
// Add to user messages key in doc. update both users with time stamp.
// Use array of objects:
// {
//     timeStamp: timestamp,
//     content: 'text'
// }

// messages doc: 
// id:
// userId: refs user,
// [{
//     contactID,
//     messages: [seeAbove]
// }]