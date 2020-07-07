import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import UserContext from '../context/UserContext';
import { Container, Button } from '@material-ui/core';
import MessageDisplay from './MessageDisplay';
import { makeStyles } from '@material-ui/core/styles';
import '../styles/messages.scss'
import axios from 'axios';

let socket;

const useStyle = makeStyles({
    button: {
        color: "#01050e",
        marginTop: "1rem"
    }
})
const Messages = () => {
    const classes = useStyle();

    const history = useHistory();

    const { userData, setUserData } = useContext(UserContext);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');

    const token = localStorage.getItem('auth-token');

    useEffect(() => {

        socket = io('https://toronto-city-travel-guide.herokuapp.com');

        if (!userData.user) {
            history.push('/')
        } else {
            axios.post("https://toronto-city-travel-guide.herokuapp.com/getUserMessages", {
                userId: userData.user.id,
                contactId: userData.contactInfo.contactId
            }, {
                headers: {
                    "x-auth-token": token
                }
            })
                .then(res => {
                    console.log('set message history', res)
                    setMessages(res.data.messageHistory)

                })


            socket.emit('joinroom', userData.user);
        }

        return () => socket.disconnect();

    }, []);

    if (messages) {
        socket.on('newMessage', data => {
            console.log('message recieved')
            const newHistory = [...messages.messageHistory, data]
            setMessages({ ...messages, messageHistory: newHistory })
        });
    }




    const sendMessage = (e) => {

        e.preventDefault();
        if (message) {
            const newMessage = {
                text: message,
                senderId: userData.user.id,
                timeStamp: Date.now()
            }
            if (!messages) {
                setMessages({ ...messages, messageHistory: [newMessage] })
            } else {
                const currentHistory = messages.messageHistory;
                const newHistory = [...currentHistory, newMessage]
                setMessages({ ...messages, messageHistory: newHistory })
            }

            axios.post("https://toronto-city-travel-guide.herokuapp.com/updateUserMessages", {
                newMessage,
                messagesId: messages._id
                // messagesId: messages ? messages._id : null
            }, {
                headers: {
                    "x-auth-token": token
                }
            })
                .catch(err => console.log(err));

            socket.emit('update', {
                newMessage,
                messages: messages,
                senderId: userData.user.id
            })

            setMessage('');
        }
    }


    return (
        <div>
            <Container>{userData.contactInfo &&
                <h1>Conversation with <span>{userData.contactInfo.contactName}</span></h1>
            }
                <MessageDisplay
                    messages={messages}
                />
                {/* <ul className="display">
                    {messages && messages.messageHistory && messages.messageHistory.map(message => {
                        return <MessageDisplay
                            message={message.text}
                            senderId={message.senderId}
                            time={message.timeStamp}
                        />
                    })}
                </ul> */}
                <input
                    className="chat-input"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                />
                <Button
                    variant='outlined'
                    className={classes.button}
                    onClick={sendMessage}
                >
                    Submit</Button>
            </Container>

        </div>
    )
}

export default Messages;