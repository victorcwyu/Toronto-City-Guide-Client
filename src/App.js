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

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    wtf: 0,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
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
            <Route path="/" exact component={Home} />
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

// why cant we keep state on refresh
// funtion calling itself on add favourites
// map rerender
