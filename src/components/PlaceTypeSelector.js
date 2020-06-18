import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";

<FormControl component="fieldset">
  {/* <FormLabel component="legend">Find</FormLabel> */}
  {/* <RadioGroup aria-label="place-type" name="place-type" value={value} onChange={handleChange}> */}
  <RadioGroup aria-label="place-type" name="place-type">
    {/* <RadioGroup aria-label="place-type" name="place-type"> */}
    <FormControlLabel value="lodging" control={<Radio />} label="accommodation" />
    <FormControlLabel value="convenience_store" control={<Radio />} label="convenience store" />
    <FormControlLabel value="tourist_attraction" control={<Radio />} label="tourist attraction" />
    {/* <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
  </RadioGroup>
</FormControl>