import React, { useState, useEffect }  from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import './App.css';
import Schedule from './components/Schedule';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Home from './components/Home';
import Header from './components/Layout/Header';
import UserContext from './context/UserContext';
import UserProfile from './components/UserProfile'
import Axios from 'axios';
import Map from './components/Map/Map';
import ScheduleDetails from './components/Schedule/ScheduleDetails';

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
      const tokenRes = await Axios.post('http://localhost:5000/auth/isTokenValid', null, {headers: {
        "x-auth-token": token
      }});

      if (tokenRes.data) {
        const userRes = await Axios.post('http://localhost:5000/getActiveUser', null, {headers: {
          "x-auth-token": token
        }});
        
        setUserData({
          token: token,
          user: userRes.data
        })
      }
    }
    checkLoggedIn()
  }, [userData.token])

  return (
    <div className="App">
      <BrowserRouter>
      <UserContext.Provider value={{userData, setUserData}}>
      {/* Added temp header to handle nav to cut down on clutter we can add a proper styled nav */}
      <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path='/signup' component={Signup} />
          <Route path='/map' component={Map} />
          <Route path='/userProfile' component={UserProfile} />
          <Route exact path='/schedule' component={ScheduleDetails} />
        </Switch>
      {/* <header className="App-header">
      </header> */}
      </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}
export default App;