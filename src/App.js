import React, { useState, useEffect }  from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import './App.css';
import Signup from './components/auth/signup';
import Schedule from './components/Schedule';
import Login from './components/auth/login'
import Map from './components/Map';
import Header from './components/Layout/Header'
import UserContext from './context/UserContext';
import Axios from 'axios';

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      if (token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }
      const tokenRes = await Axios.post('http://localhost:5000/isTokenValid', null, {headers: {
      "x-auth-token": token
      }});
      console.log(tokenRes);

    }
    checkLoggedIn()
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
      <UserContext.Provider>

      {/* Added temp header to handdle nav to cut down on clutter we can add a proper styled nav */}
      <Header />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path='/signup' component={Signup} />
        </Switch>
      {/* <header className="App-header">
      </header> */}
      <Map />
      <Schedule/>
      </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
