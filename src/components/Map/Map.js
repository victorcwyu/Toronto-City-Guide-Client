import React, { useState, useEffect, useContext } from 'react';
import Autocomplete from './Autocomplete';
import "../../styles/Map.scss";

import FavouritesMap from './FavouritesMap';

// import MapToggle from './MapToggle';
import Switch from '@material-ui/core/Switch';
import UserContext from '../../context/UserContext';

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

export default function Map() {
  const [loadMap, setLoadMap] = useState(false);


  const [favouritesOn, setFavouritesOn] = useState(false);

  const handleChange = (event) => {
    setFavouritesOn(!favouritesOn);
  };

  useEffect(() => {
    loadGoogleMapScript(() => {
      setLoadMap(true);
    });
  }, []);

  return (
    <div id="map-page">
      <h1>Map</h1>
      <div id="toggle">
        <h2>Search</h2>
        <Switch
          selection={favouritesOn}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <h2>Favourites</h2>
      </div>
      {!loadMap && <div>Loading...</div> }
      {!favouritesOn && <Autocomplete />}
      {favouritesOn && <FavouritesMap />}
    </div>
  )
}
