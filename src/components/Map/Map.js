import React, { useState } from "react";
import Autocomplete from "./Autocomplete";
import "../../styles/Map.scss";
import UserMap from "./UserMap";
import Switch from "@material-ui/core/Switch";

export default function Map() {
  const [state, setState] = useState({ checked: true });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

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
      {state.checked === true && <Autocomplete />}
      {state.checked === false && <UserMap home={false} />}
    </div>
  );
}
