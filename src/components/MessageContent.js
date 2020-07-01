import React, {useContext} from 'react';
import UserContext from '../context/UserContext';
import '../styles/messageContent.scss'

const MessageContent = ({message, senderId, time}) => {
    const {userData} = useContext(UserContext);

  return (
    <li>
    <p className={userData.user.id === senderId ? "sender-message" : "contact-message"}>{message}</p>
    </li>
  )
}

export default MessageContent;