import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import "../../styles/Map.scss";
import UserMap from "./UserMap";
import Switch from "@material-ui/core/Switch";

import { loadGoogleMapScript } from "../../helpers/helpers.js";

export default function Map() {
  const [loadMap, setLoadMap] = useState(false);
  const [state, setState] = useState({ checked: true });

  const handleChange = (event) => {
    console.log(state);
    setState({ ...state, [event.target.name]: event.target.checked });
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
          checked={state.checked}
          onChange={handleChange}
          name="checked"
          inputProps={{ "aria-label": "primary checkbox" }}
        />
        <h2>Search</h2>
      </div>
      {!loadMap && <div>Loading...</div>}
      {state.checked === true && <Autocomplete />}
      {state.checked === false && <UserMap home={false} />}
    </div>
  );
}
