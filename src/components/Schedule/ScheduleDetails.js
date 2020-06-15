import React, {useState} from "react";
import {
  Container,
  FormControl,
  Input,
  InputLabel,
  Button,
  TextField,
} from "@material-ui/core";
import DatePicker from 'react-date-picker';
import '../../styles/ScheduleDetails.scss';

export default function ScheduleDetails() {

  const handleChange = (date) => {
    setSelectedDate(() => date);
  }

  let [selectedDate,setSelectedDate] = useState(new Date());
  return (
    <Container className="schedule-details">
      <h1>Schedule Details</h1>
      <FormControl>
      <TextField id="title" label="Title" />
      <TextField id="description" label="Description" />
      <br/>
      <br/>
        <DatePicker
          onChange={handleChange}
          value={selectedDate}
        />
        <br/>
       <Button variant="contained" color="primary">
       Save
      </Button>
       </FormControl>
       <br/>
    </Container>
  );
}
