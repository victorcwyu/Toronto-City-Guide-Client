import React, { useState, useContext } from "react";
import {
  Container,
  FormControl,
  TextField,
} from "@material-ui/core";
import "../../styles/ScheduleDetails.scss";
import axios from "axios";
import DateFnsUtils from '@date-io/date-fns';
import UserContext from "../../context/UserContext";

import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

export default function ScheduleDetails() {
  const { userData, setUserData } = useContext(UserContext);
  const [state, setState] = useState({
    bookedDate: null,
    title: "",
    description: "",
  });

  const handleChange = (date) => {
    console.log('date:', date);
    setState({ ...state, bookedDate: date });
  };

  const handleSchedule = async (e) => {
    e.preventDefault();

    const scheduleRes = await axios.post('https://toronto-city-travel-guide.herokuapp.com/api/schedules/post', state, {
      headers: {
        "x-auth-token": localStorage.getItem('auth-token')
      }
    })
      .then(() => {
        setState({ ...state, title: "", description: "", bookedDate: null })
        setUserData({ ...userData, wtf: userData.wtf + 1 })
      })
    console.log('output', scheduleRes);
  }

  return (
    <Container className="schedule-details">
      <h1>Schedule Details</h1>
      <FormControl>
        <TextField
          id="title"
          label="Title"
          value={state.title}
          onChange={(e) => setState({ ...state, title: e.target.value })}
        />
        <TextField
          id="description"
          label="Description"
          value={state.description}
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
        <button onClick={handleSchedule}>
          Save
        </button>
      </FormControl>
      <br />
    </Container>
  );
}
