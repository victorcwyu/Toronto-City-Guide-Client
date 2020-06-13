import React, {useState} from 'react';
import { Container, TextField, Typography, Button } from '@material-ui/core';
import axios from 'axios'

export default function Login () {
	const [userInfo, setUserInfo] = useState({
		username: '',
		password: ''
	});

	const handleLogin = (e) => {
		e.preventDefault();
		axios.post('http://localhost:5000/login', userInfo)
		.then(res => console.log(res.data))
		.catch(err => console.log(err));
	}
	
    return (
        <div>
            <Container>
							<Typography variant='h2'>Login</Typography>
            	<form onSubmit={handleLogin}>
                <div>
                  <TextField id="standard-basic" label="Username" value={userInfo.username} onChange={e => setUserInfo({...userInfo, username: e.target.value})} />
						 		</div>    
								 <div>
                  <TextField id="standard-basic" label="Password" value={userInfo.password} onChange={e => setUserInfo({...userInfo, password: e.target.value})}/>
						 		</div>   
								 <Button variant='contained' type='submit'>Submit</Button>
              </form>
            </Container>
        </div>
    )
}