import React, { useRef, useEffect } from "react";
import axios from "axios";

import { loadGoogleMapScript, intializeGoogleMap } from "../../helpers/google.js"
import { favouritesCoordinates, favouritesMarkers } from "../../helpers/selectors.js"

const HomeMap = () => {
  const googleMapRef = useRef(null);
  const token = localStorage.getItem("auth-token");

  const getFavouritesData = async () => {
    if (!token) {
      return null
    } else {
      let res = await axios.get("https://toronto-city-travel-guide.herokuapp.com/getFavourites", { headers: { "x-auth-token": token } });
      const favourites = res.data.favourites
      if (favourites === null || favourites[0] === undefined) {
        return null
      } else if (favourites[0] !== undefined) {
        return favouritesCoordinates(favourites)
      }
    }
  };

  useEffect(() => {
    loadGoogleMapScript(() => {
      intializeGoogleMap(googleMapRef.current)
    });
    createHomeMap();
  }, [token]);

  // Retrieve favourites and add create home map
  const createHomeMap = async () => {
    favouritesMarkers(await getFavouritesData(), await intializeGoogleMap(googleMapRef.current))

  };

  return (
    <>
      <div
        id="homeMap"
        ref={googleMapRef}
      />
    </>
  )
}

export default HomeMap;