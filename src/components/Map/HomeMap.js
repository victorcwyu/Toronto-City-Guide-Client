import React, { useRef, useEffect } from "react";
import axios from "axios";

import { loadGoogleMapScript, intializeGoogleMap } from "../../helpers/google.js"

let markers = [];
let infowindows = [];

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
      // map through favouritesCoordinates array and add marker for each place
      favouritesCoordinates.forEach((place, i) => {
        markers[i] = new window.google.maps.Marker({ position: place[0], map: map });
        infowindows[i] = new window.google.maps.InfoWindow({
          content: `<b>${place[1]}</b>
            <br>
            ${place[2]}
            <br>
          `
        });
        // open an infowindow when the marker is clicked
        markers[i].addListener('click', function () {
          infowindows[i].open(map, markers[i]);
        });
      });
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