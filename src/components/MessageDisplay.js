import React, {useContext} from 'react';
import UserContext from '../context/UserContext';
import '../styles/messageDisplay.scss'

const MessageDisplay = ({message, senderId, time}) => {
    const {userData} = useContext(UserContext);

  return (
    <div>
    <p className={userData.user.id === senderId ? "sender-message" : "contact-message"}>{message}</p>
    </div>
  )
}

export default MessageDisplay;