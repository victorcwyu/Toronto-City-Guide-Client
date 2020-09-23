import React, { useEffect, useRef } from "react";
import axios from "axios";

let markers = [];
let infowindows = [];

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// load google map script
const loadGoogleMapScript = (callback) => {
  if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
};

const HomeMap = () => {
  const googleMapRef = useRef(null);
  const token = localStorage.getItem("auth-token");

  const intializeGoogleMap = () => {
    return (
      new window.google.maps.Map(googleMapRef.current, {
        center: { lat: 43.6560811, lng: -79.3823601 },
        zoom: 14,
        disableDefaultUI: true
      }))
  }

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
      intializeGoogleMap()
    });
    initPlaceAPI();
  }, [token]);

  // Initialize the Google Place autocomplete
  const initPlaceAPI = async () => {
    let favourites = await getFavouritesData();
    if (favourites === null || favourites[0] === undefined) {
      return null
    } else if (favourites[0] !== undefined) {
      const map = intializeGoogleMap()
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