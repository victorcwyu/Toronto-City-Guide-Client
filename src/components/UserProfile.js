import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext'
import axios from "axios"

import UserContactInfo from './UserContactInfo';

export default function UserProfile() {
  const history = useHistory();

    const {userData, setUserData} = useContext(UserContext);

    const [input , setInput] = useState('')
    const [seachdata, setSeachdata] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async e => {
      e.preventDefault();

      const token = localStorage.getItem('auth-token');

      try {
        axios.post("http://localhost:5000/findUser", {username: input}, {headers: {
          "x-auth-token": token
        }})
        .then(res => {
          setSeachdata(res.data)
        })
      }
      catch (err) {
        console.error(err)
      }
    }

    const handleAddContact = async e => {
      e.preventDefault();
      
      const token = localStorage.getItem('auth-token');

      try {
        const contactData = await axios.post("http://localhost:5000/addContact", {userData: seachdata}, {headers: {
          "x-auth-token": token
        }})
        const newContacts = [...userData.user.contacts, contactData.data.userData];
        const newUserData = {...userData.user, contacts: newContacts};
        setUserData({...userData.user, user: newUserData})
      }
      catch (err) {
        console.error(err)
      }
    }
    
    if(userData.user) {
    return (
        <div className="contacts">
          <h1>Add a Contact</h1>
          <input
          type="text"
          name="finduser"
          placeholder="username"
          value={input}
          onChange={e => setInput(e.target.value)}
          />
          <div>
          <button 
          onClick={handleSearch}
          >
            Search
          </button>
          </div>
          {seachdata && (
            <div>
              {seachdata.username}
              <div
              onClick={handleAddContact}
              >+</div>
            </div>
          )}
          <h1>Contacts</h1>
          {userData && userData.user.contacts.map((contact, index) => {
            return (<UserContactInfo 
            key={index}
            contactId={contact.id}
            contactName={contact.username}
            />)
          })}
          <div>
          </div>
        </div>
    )} else {
      return (
        <div />
      )
    }
}

// BUGS:
// When we refresh there is no userdata, restrict this if user data is undefined 