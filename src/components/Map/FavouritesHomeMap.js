import React, { useEffect, useRef } from "react";
import axios from "axios";

let markers = [];
let infowindows = [];

const FavouritesHomeMap = () => {

  const googleMapRef = useRef(null);
  const token = localStorage.getItem("auth-token");

  const getFavouritesData = async () => {
    let res = await axios.get("https://toronto-city-travel-guide.herokuapp.com/getFavourites", { headers: { "x-auth-token": token } });
    return res.data.favourites;
  };

  useEffect(() => {
    initPlaceAPI();
  }, []);

  // Initialize the Google Place autocomplete
  const initPlaceAPI = async () => {

    // map through favourites array, extract the latitude and longitude of each place
    let favourites = await getFavouritesData();

    const favouritesCoordinates = favourites.map((favourite) => {
      return [
        { lat: favourite.geometry.location.lat, lng: favourite.geometry.location.lng },
        favourite.name,
        favourite.vicinity
      ];
    })

    // Initialize the Google map
    const map = new window.google.maps.Map(googleMapRef.current, {
      center: { lat: 43.6560811, lng: -79.3823601 },
      zoom: 14,
      disableDefaultUI: true
    });

    // map through favouritesCoordinates array and add marker for each place
    // open an infowindow when the marker is clicked
    favouritesCoordinates.forEach((place, i) => {
      markers[i] = new window.google.maps.Marker({ position: place[0], map: map });
      infowindows[i] = new window.google.maps.InfoWindow({
        content: `<b>${place[1]}</b>
          <br>
          ${place[2]}
          <br>
        `
      });
      markers[i].addListener('click', function () {
        infowindows[i].open(map, markers[i]);
      });
    });
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

export default FavouritesHomeMap;