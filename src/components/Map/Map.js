import React, { useState, useEffect } from 'react';
import Autocomplete from './Autocomplete';
import "../../styles/Map.scss";
import FavouritesMap from './FavouritesMap';
import Switch from '@material-ui/core/Switch';

import { loadGoogleMapScript } from "../../helpers/google.js"

export default function Map() {
  const [loadMap, setLoadMap] = useState(false);
  const [searchOn, setSearchOn] = useState(false);

  const handleChange = (event) => {
    setSearchOn(!searchOn);
  };

  useEffect(() => {
    loadGoogleMapScript(() => {
      setLoadMap(true);
    });
  }, []);

  return (
    <div id="map-page">
      <div id="toggle">
        <h2>Favourites</h2>
        <Switch
          selection={searchOn}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <h2>Search</h2>
      </div>
      {!loadMap && <div>Loading...</div>}
      {searchOn && <Autocomplete />}
      {!searchOn && <FavouritesMap />}
    </div>
  )
}
