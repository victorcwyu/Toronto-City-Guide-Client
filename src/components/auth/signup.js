import React from 'react';
import { Container, TextField, Typography, Button } from '@material-ui/core';

function Signup () {
    return (
        <div>
            <Container>
							<Typography variant='h2'>Enter Your Information</Typography>
            	<form action='/signup' method='POST'>
                <div>
                  <TextField id="standard-basic" label="Username" />
						 		</div>   
								 <div>
                  <TextField id="standard-basic" label="Email" />
						 		</div>   
								 <div>
                  <TextField id="standard-basic" label="Password" />
						 		</div>   
								 <div>
                  <TextField id="standard-basic" label="Confirm Password" />
						 		</div> 
								 <Button variant='contained' type='submit'>Submit</Button>
              </form>
            </Container>
						
        </div>  
    )
}

export default Signup