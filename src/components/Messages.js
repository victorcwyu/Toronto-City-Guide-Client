import React, {useEffect, useContext, useState} from 'react';
import io from 'socket.io-client';
import UserContext from '../context/UserContext';
import { TextField, Container, Button } from '@material-ui/core';
import MessageDisplay from './MessageDisplay';

const Messages = () => {
    const {userData, setUserData} = useContext(UserContext);
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');

    let socket = io('http://localhost:5000');
    let roomId;  

    useEffect(() => {
       socket.emit('userData', {
           userId: userData.user.id,
           contactId: userData.contactId
       })

       socket.on('roomData', data => {
           console.log('ROOMDATA: ', data);
           roomId = data._id;
           setMessages(data)
        socket.emit('join', roomId);
        })
        
        socket.on('joinResponse', data => console.log(data));
        
        return () => socket.disconnect();
    }, []);
    
    // Put into the other use Effect
    useEffect(() => {
        socket.on('serverMessage', data => {
            setMessages({...messages, messageHistory: data.messages.messageHistory});
        })
    }, [message])

   const sendMessage = (e) => {
       e.preventDefault();
       if (message) {
           socket.emit('clientMessage', {
            message,
            messages,
            userId: userData.user.id
        });
           console.log('SENT MESSAGE: ', message);
           setMessage('');
       }
   } 
   
 
    return (
        <div>
            <Container>
            <h1>Messages</h1>
            <div className="display">
                {messages.messageHistory && messages.messageHistory.map(message => {
                    return <MessageDisplay 
                    message={message.text}
                    senderId={message.senderId}
                    time={message.timeStamp}
                />
                })}
            </div>
            <input
                value={message}
                onChange={e => setMessage(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                />
                <Button onClick={sendMessage}>Submit</Button>
            </Container>

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