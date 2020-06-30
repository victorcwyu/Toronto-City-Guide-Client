import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { Container, Typography, Button, FormControl, InputLabel, Input } from '@material-ui/core';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
  form : {
    marginTop: "5rem"
  },
  header: {
    color: "#1a2656",
  },
  button: {
    marginTop: "3rem",
    borderColor: "#1a2656"
  }
})

export default function Login () {
  const classes = useStyle();
	const [userInfo, setUserInfo] = useState({
		username: '',
		password: ''
  });
  const {userData, setUserData} = useContext(UserContext)
  const history = useHistory();

	const handleLogin = async (e) => {
		e.preventDefault();
    const loginRes = await axios.post('https://toronto-city-travel-guide.herokuapp.com/auth/login', userInfo);
    localStorage.setItem('auth-token', loginRes.data.token);
    const token = localStorage.getItem('auth-token');
    setUserData({...userData, token: token})
    history.push('/');
	}
	
    return (
        <div>
            <Container>
							<Typography variant='h2' className={classes.header}>Login</Typography>
            	<form onSubmit={handleLogin} className={classes.form}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input id="username" type="text" value={userInfo.username} onChange={e => setUserInfo({...userInfo, username: e.target.value})} /> 
                </FormControl>
								<FormControl fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input id="password" type="password" value={userInfo.password} onChange={e => setUserInfo({...userInfo, password: e.target.value})}/>  
                </FormControl>
								<Button variant="outlined" type='submit' className={classes.button}>Submit</Button>
              </form>
            </Container>
        </div>
    )
}