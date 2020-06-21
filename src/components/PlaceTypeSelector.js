// import React, { useEffect, useRef, useState } from "react";
// import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
// import "../styles/Autocomplete.scss";

// function PlaceTypeSelector() {
//   let placeType = "";

//   return(
//     <div id="findhotels">
//       <h2>Find</h2>
//       <FormControl component="fieldset">
//         {/* <FormLabel component="legend">Find</FormLabel> */}
//         {/* <RadioGroup aria-label="place-type" name="place-type" value={value} onChange={handleChange}> */}
//         <RadioGroup 
//           aria-label="place-type" 
//           name="place-type"
//           // value="convenience_store"
//           // onChange={(e, { value }) => {
//           //   // placeType = value
//           //   // console.log("HIIIII", value)
//           // }}
//         >
//           {/* <RadioGroup aria-label="place-type" name="place-type"> */}
//           <FormControlLabel value="lodging" control={<Radio />} label="accommodation" />
//           <FormControlLabel value="convenience_store" control={<Radio />} label="convenience store" />
//           <FormControlLabel value="tourist_attraction" control={<Radio />} label="tourist attraction" />
//           {/* <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
//         </RadioGroup>
//       </FormControl>
//     </div>
//   );
// }
// export default PlaceTypeSelector;









import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
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
  const [placeType, setPlaceType] = useState('');

  const handleChange = (event) => {
    setPlaceType(event.target.value);
  };

  console.log("haiiiii", placeType);

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