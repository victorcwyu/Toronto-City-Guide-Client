import React, {useState} from 'react';
import { Container, TextField, Typography, Button, FormControl, InputLabel, Input } from '@material-ui/core';
import axios from 'axios'

export default function Signup () {
	const [userInfo, setUserInfo] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const handleSignUp = (e) => {
		e.preventDefault();
		axios.post('http://localhost:5000/signup', userInfo)
		.then(res => console.log(res.data))
		.catch(err => console.log(err));
	}
	
    return (
        <div>
            <Container>
							<Typography variant='h2'>Create An Account</Typography>
            	<form onSubmit={handleSignUp}>
                <FormControl fullWidth>
                  <InputLabel htmlfor="username">Username</InputLabel>
                  <Input id="username" type="text" value={userInfo.username} onChange={e => setUserInfo({...userInfo, username: e.target.value})} />
						 		</FormControl> 
                <FormControl fullWidth>
                  <InputLabel htmlfor="email">Email</InputLabel>
                  <Input id="email" type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} />
						 		</FormControl> 
                <FormControl fullWidth>
                  <InputLabel htmlfor="password">Password</InputLabel>
                  <Input id="password" type="password" value={userInfo.password} onChange={e => setUserInfo({...userInfo, password: e.target.value})} />
						 		</FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlfor="confirmPassword">Confirm Password</InputLabel>
                  <Input id="confirmPassword" type="password" value={userInfo.confirmPassword} onChange={e => setUserInfo({...userInfo, confirmPassword: e.target.value})} />
						 		</FormControl>           
								 <Button variant='contained' type='submit'>Submit</Button>
              </form>
            </Container>
        </div>
    )
}