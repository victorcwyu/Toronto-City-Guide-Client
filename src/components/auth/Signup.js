import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { Container, Typography, Button, FormControl, InputLabel, Input } from '@material-ui/core';
import axios from 'axios'
import UserContext from '../../context/UserContext';

export default function Signup () {
	const [userInfo, setUserInfo] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
  });
  const {userData, setUserData} = useContext(UserContext);
  const history = useHistory()
  
  


	const handleSignUp = async (e) => {
    try {
      e.preventDefault();
      const signUpRes = await axios.post('http://localhost:5000/auth/signup', userInfo);
      if (signUpRes.status === 200){
        const loginRes = await axios.post('http://localhost:5000/auth/login', { username: userInfo.username, password: userInfo.password });
        localStorage.setItem('auth-token', loginRes.data.token);
        const token = localStorage.getItem('auth-token');
        setUserData({...userData, token: token})
        history.push('/');
      } else {
        console.log(signUpRes)
      }
    } catch (err) {
      console.log(err);
    }
	}
	
    return (
        <div>
            <Container>
							<Typography variant='h2'>Create An Account</Typography>
            	<form onSubmit={handleSignUp}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input id="username" type="text" value={userInfo.username} onChange={e => setUserInfo({...userInfo, username: e.target.value})} />
						 		</FormControl> 
                <FormControl fullWidth>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input id="email" type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} />
						 		</FormControl> 
                <FormControl fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input id="password" type="password" value={userInfo.password} onChange={e => setUserInfo({...userInfo, password: e.target.value})} />
						 		</FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <Input id="confirmPassword" type="password" value={userInfo.confirmPassword} onChange={e => setUserInfo({...userInfo, confirmPassword: e.target.value})} />
						 		</FormControl>           
								 <Button variant='contained' type='submit'>Submit</Button>
              </form>
            </Container>
        </div>
    )
}