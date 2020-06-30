import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Button } from '@material-ui/core';
import UserContactInfo from './UserContactInfo';
import axios from "axios"


const useStyle = makeStyles({
  container: {
    color: "#14a2f4",
  },
  button: {
    marginTop: "1rem",
    borderColor: "#1a2656"
  }
})

export default function UserProfile() {
  const classes = useStyle();

    const {userData, setUserData} = useContext(UserContext);

    const [input , setInput] = useState('')
    const [searchData, setSearchdata] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async e => {
      e.preventDefault();

      const token = localStorage.getItem('auth-token');

      try {
        axios.post("https://toronto-city-travel-guide.herokuapp.com/findUser", {username: input}, {headers: {
          "x-auth-token": token
        }})
        .then(res => {
          setSearchdata(res.data)
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

        const contactData = await axios.post("https://toronto-city-travel-guide.herokuapp.com/addContact", {userData: searchdata}, {headers: {
          "x-auth-token": token
        }})
        const newContacts = [...userData.user.contacts, contactData.data.userData];
        const newUserData = {...userData.user, contacts: newContacts};
        setUserData({...userData.user, user: newUserData})
        setSearchdata(null)
      }
      catch (err) {
        console.error(err)
      }
    }
    
    if(userData.user) {
    return (
        <Container>
          <h1>Add a Contact</h1>
          <input
          type="text"
          name="finduser"
          placeholder="username"
          value={input}
          onChange={e => setInput(e.target.value)}
          />
          <div>
          {!searchData &&
          <Button
          onClick={handleSearch}
          variant='outlined' 
          type='submit' 
          className={classes.button}
          >
            Search
          </Button>
        }
          </div>
          {searchData && (
            <div>
              <h3>{searchData.username}</h3>
              <div>  
              <Button
              onClick={handleAddContact}
              variant='outlined' 
              className={classes.button}
              >
                Add Contact
              </Button>
              </div>
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
          </Container>
    )} else {
      return (
        <div />
      )
    }
}

// BUGS:
// When we refresh there is no userdata, restrict this if user data is undefined 