import React, {useState} from 'react';
import { Container, TextField, Typography, Button } from '@material-ui/core';
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
                <div>
                  <TextField id="standard-basic" label="Username" value={userInfo.username} onChange={e => setUserInfo({...userInfo, username: e.target.value})} />
						 		</div>   
								 <div>
                  <TextField id="standard-basic" label="Email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})}/>
						 		</div>   
								 <div>
                  <TextField id="standard-basic" label="Password" value={userInfo.password} onChange={e => setUserInfo({...userInfo, password: e.target.value})}/>
						 		</div>   
								 <div>
									<TextField id="standard-basic" label="Confirm Password" value={userInfo.confirmPassword} onChange={e => setUserInfo({...userInfo, confirmPassword: e.target.value})} />
						 		</div> 
								 <Button variant='contained' type='submit'>Submit</Button>
              </form>
            </Container>
        </div>
    )
}