import React, { useState} from "react";
import {
  Container,
  FormControl,
  Input,
  InputLabel,
  Button,
  TextField,
} from "@material-ui/core";
import DatePicker from "react-date-picker";
import "../../styles/ScheduleDetails.scss";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ScheduleDetails() {
  const [state, setState] = useState({
    date: new Date(),
    title: "",
    description: "",
  });

  const handleChange = (date) => {
    setState({ ...state, date: date });
  };

 /* const handleSchedule = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth-token");
    try {
      axios
        .post(
          "http://localhost:5000/api/schedules",
          { scheduleData: state },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
        });
    } catch (err) {
      console.error(err);
    }
  };*/


	const handleSchedule = async (e) => {
		e.preventDefault();
		const scheduleRes = await axios.post('http://localhost:5000/api/schedules', state,{
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
        <DatePicker onChange={handleChange} value={state.date} />
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
