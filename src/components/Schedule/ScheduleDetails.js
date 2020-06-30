import React, { useState} from "react";
import {
  Container,
  FormControl,
  Input,
  InputLabel,
  Button,
  TextField,
} from "@material-ui/core";
//import DateFnsUtils from '@date-io/date-fns';
//import DatePicker from "react-date-picker";
//import DateTimePicker from "react-datetime-picker";
import "../../styles/ScheduleDetails.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns';

import {KeyboardDateTimePicker,MuiPickersUtilsProvider}  from "@material-ui/pickers";

export default function ScheduleDetails() {
  const [state, setState] = useState({
    bookedDate: null,
    title: "",
    description: "",
  });

  const handleChange = (date) => {
    console.log('date:',date);
    setState({ ...state, bookedDate: date });
  };

	const handleSchedule = async (e) => {
    e.preventDefault();
 
    const scheduleRes = await axios.post('http://localhost:5000/api/schedules/post', state,{
      headers: {
        "x-auth-token": localStorage.getItem('auth-token')
      }
    });
    console.log('output',scheduleRes);
	}

  return (
    <Container className="schedule-details">
      <h1>Schedule Details</h1>
      <FormControl>
        <TextField
          id="title"
          label="Title"
          onChange={(e) => setState({ ...state, title: e.target.value })}
        />
        <TextField
          id="description"
          label="Description"
          onChange={(e) => setState({ ...state, description: e.target.value })}
        />
        <br />
        <br />
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
        variant="inline"
        ampm={false}
        label="With keyboard"
        value={state.bookedDate}
        onChange={handleChange}
        onError={console.log}
        disablePast
        format="yyyy/MM/dd HH:mm"
      />
     </MuiPickersUtilsProvider>
        <br />
        <button  onClick={handleSchedule}>
        <Link to='/'>
        Save
        </Link>
        </button>
      </FormControl>
      <br />
    </Container>
  );
}
