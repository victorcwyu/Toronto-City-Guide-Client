import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function PlaceTypeSelector() {

  const classes = useStyles();
  const [placeType, setPlaceType] = useState("");

  function handleChange(event) {
    setPlaceType(event.target.value)
    // Store place type in local storage for autocomplete to use as an option when searching
    localStorage.setItem("searchPlaceType", event.target.value)
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Find</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={placeType}
          onChange={handleChange}
          label="place-type"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"lodging"}>accommodation near:</MenuItem>
          <MenuItem value={"convenience_store"}>convenience stores near:</MenuItem>
          <MenuItem value={"tourist_attraction"}>tourist attractions near:</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}