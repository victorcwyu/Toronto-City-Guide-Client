import React, {useContext} from 'react';
import UserContext from '../context/UserContext';
import '../styles/messageContent.scss'

const MessageContent = ({message, senderId, time}) => {
    const {userData} = useContext(UserContext);

  return (
    <div className={userData.user.id === senderId ? "sender-message" : "contact-message"}>
    <p className="content">{message}</p>
    </div>
  )
}

export default MessageContent;