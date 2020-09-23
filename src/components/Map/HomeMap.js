import React, { useRef, useEffect } from "react";
import axios from "axios";

import { loadGoogleMapScript, intializeGoogleMap } from "../../helpers/google.js"
import { favouritesMarkers } from "../../helpers/selectors.js"

const HomeMap = () => {
  const googleMapRef = useRef(null);
  const token = localStorage.getItem("auth-token");

  const getFavouritesData = async () => {
    if (!token) {
      return null
    } else {
      let res = await axios.get("https://toronto-city-travel-guide.herokuapp.com/getFavourites", { headers: { "x-auth-token": token } });
      return res.data.favourites;
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
    let favourites = await getFavouritesData();
    if (favourites === null || favourites[0] === undefined) {
      return null
    } else if (favourites[0] !== undefined) {
      const map = intializeGoogleMap(googleMapRef.current)
      // map through favourites array, extract the latitude and longitude of each place
      const favouritesCoordinates = favourites.map((favourite) => {
        return [
          { lat: favourite.geometry.location.lat, lng: favourite.geometry.location.lng },
          favourite.name,
          favourite.vicinity
        ];
      })
      favouritesMarkers(favouritesCoordinates, map)
    }
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