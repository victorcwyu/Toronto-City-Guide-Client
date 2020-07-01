import React, {useContext} from 'react';
import UserContext from '../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
  sender: {
    fontSize: '10px',
  },
  contact: {
    fontSize: '20px',
  }
})

const MessageDisplay = ({message, senderId, time}) => {
    let classes = useStyle();
    const {userData} = useContext(UserContext);
    // console.log(userData.user.id === senderId)


  return (
    <div className={userData.user.id === senderId ? "sender-message" : "contact-message"}>
    {message}
    </div>
  )
}

export default MessageDisplay;