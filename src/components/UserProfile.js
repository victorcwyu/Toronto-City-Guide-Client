import React, { useState, useContext } from 'react'
import UserContext from '../context/UserContext'
import axios from "axios"

export default function UserProfile() {


    // Make this grab the data from usercontext 

    // const {userData, setUserData} = useContext(UserContext);
    // const {userData, setUserData} = UserContext.value 
    // // const [state, setState] = useContext(userData);
    // console.log("this", userData)

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
        axios.post("http://localhost:5000/addContact", {userData: seachdata}, {headers: {
          "x-auth-token": token
        }})
        .then(res => {
          console.log(res)
        })
      }
      catch (err) {
        console.error(err)
      }
    }

    return (
        <div className="contacts">
          <input
          type="text"
          name="finduser"
          placeholder="username"
          value={input}
          onChange={e => setInput(e.target.value)}
          />
          <button 
          onClick={handleSearch}
          >Search</button>
          {seachdata && (
            <div>
              {seachdata.username}
              <div
              onClick={handleAddContact}
              >+</div>
            </div>
          )}
        </div>
    )
}