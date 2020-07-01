import React, { useState, useContext } from "react";
import {
  Container,
  FormControl,
  TextField,
  Button
} from "@material-ui/core";
import "../../styles/ScheduleDetails.scss";
import axios from "axios";
import DateFnsUtils from '@date-io/date-fns';
import UserContext from "../../context/UserContext";
import { makeStyles } from '@material-ui/core/styles';

import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const useStyle = makeStyles({
  root: {
    border: '.2em solid #01050e',
    width: '80%',
    boxShadow: '10px 10px 5px 0px rgba(0, 0, 0, 0.75)',
    padding: '20px',
    margin: '100px auto',
    backgroundColor: '#287ac3',
  },
  button: {
    border: 'none',
    // color: "#01050e",
    color: "white",
    marginTop: "0.5rem",
    textTransform: "none",
    backgroundColor: '#1a2656',
    cursor: 'pointer',
    '&:hover': {
    color: '#0f508b',
    backgroundColor: 'white',
    }
  }
}) 



export default function ScheduleDetails() {
  const classes = useStyle();
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
    // <Container className="schedule-details">
    <Container className={classes.root}>
      <h1>What Are You Planning?</h1>
      <FormControl>
        <TextField
          id="title"
          label="Title"
          value={state.title}
          onChange={(e) => setState({ ...state, title: e.target.value })}
        />
        <br />
        <TextField
          id="description"
          label="Description"
          value={state.description}
          onChange={(e) => setState({ ...state, description: e.target.value })}
        />
        <br />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>


          <KeyboardDateTimePicker
            variant="inline"
            ampm={false}
            label="YYYY-MM-DD, HH:MM"
            value={state.bookedDate}
            onChange={handleChange}
            onError={console.log}
            disablePast
            format="yyyy/mm/dd hh:mm"
          />



        </MuiPickersUtilsProvider>
        <br />
        <Button 
        variant="outlined"
        className={classes.button}
        onClick={handleSchedule}>
          Save to schedule
        </Button>
      </FormControl>
      <br />
    </Container>
  );
}
