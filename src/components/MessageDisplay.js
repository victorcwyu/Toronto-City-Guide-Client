import React from 'react';
import '../styles/messageDisplay.scss';
import MessageContent from './MessageContent'

const MessageDisplay = ({messages}) => {
    return (
        <div className="display-container">
            <div className="display">
            {messages && messages.messageHistory && messages.messageHistory.map(message => {
                return <MessageContent
                message={message.text}
                senderId={message.senderId}
                time={message.timeStamp}
                />
            })}
            </div>
        </div>
    )
}

export default MessageDisplay;