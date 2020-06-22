import React, {useEffect} from 'react';
import io from 'socket.io-client';

const ENDPOINT = process.env.ENDPOINT || 5000;

let socket;

const Messages = () => {
    useEffect(() => {
        socket = io.connect('http://localhost:5000');
        return () => socket.disconnect();
    },[]);

    return (
        <h1>Messages</h1>
    )
}

export default Messages;