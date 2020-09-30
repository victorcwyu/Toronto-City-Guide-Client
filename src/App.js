import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import Header from "./components/Layout/Header";
import UserContext from "./context/UserContext";
import UserProfile from "./components/UserProfile";
import Axios from "axios";
import Map from "./components/Map/Map";
import index from "./components/Schedule/index";
import Messages from "./components/Messages";
import FAQ from "./components/FAQ";

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    wtf: 0,
    googleMapsLoaded: false,
  });

  useEffect(() => {
    // this function loads the google maps JavaScript API and adds it to the state and the global window object
    const onScriptload = () => {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", function () {
        setUserData((userData) => ({
          googleMapsLoaded: !userData.googleMapsLoaded,
        }));
      });
      localStorage.setItem("googleMaps", "true");
    };
    onScriptload();
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      let googleMaps = JSON.parse(localStorage.getItem("googleMaps"));

      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "https://toronto-city-travel-guide.herokuapp.com/auth/isTokenValid",
        null,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (tokenRes.data) {
        const userRes = await Axios.post(
          "https://toronto-city-travel-guide.herokuapp.com/getActiveUser",
          null,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        setUserData({
          token: token,
          user: userRes.data,
          googleMapsLoaded: googleMaps,
        });
      }
    };
    checkLoggedIn();
  }, [userData.token]);

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          {/* Added temp header to handle nav to cut down on clutter we can add a proper styled nav */}
          <Header />
          <Switch>
            {userData.googleMapsLoaded === true && (
              <Route path="/" exact component={Home} />
            )}
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/map" exact component={Map} />
            <Route path="/userProfile" exact component={UserProfile} />
            <Route path="/schedule" exact component={index} />
            <Route path="/messages" exact component={Messages} />
            <Route path="/faq" exact component={FAQ} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}
export default App;
