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
import Map from './components/Map';
import ScheduleDetails from './components/Schedule/ScheduleDetails';

// const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// // load google map script
// const loadGoogleMapScript = (callback) => {
//   if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
//     callback();
//   } else {
//     const googleMapScript = document.createElement("script");
//     googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
//     window.document.body.appendChild(googleMapScript);
//     googleMapScript.addEventListener("load", callback);
//   }
// };

function App() {
  // const [loadMap, setLoadMap] = useState(false);

  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });  

  useEffect(() => {

    // loadGoogleMapScript(() => {
    //   setLoadMap(true);
    // });

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