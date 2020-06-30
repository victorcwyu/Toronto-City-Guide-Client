import React, { useState, useContext, useEffect } from "react";
import { Container } from "@material-ui/core";
import "../../styles/Schedule.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { date } from "date-fns/locale/af";
import moment from "moment"

export default function Schedule() {
  const [schedules, setSchedules] = useState();
  const [selectedDate, setSelectedDate] = useState(moment().zone(4))

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .post("http://localhost:5000/api/schedules/get", {
        selectedDate: selectedDate.format('YYYY-MM-DD')
      }, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        setSchedules(res.data);
      });
  };

  const handleAdd = () => {
    setSelectedDate(selectedDate.add(1, 'd'))
    getData();
  }
  
  const handleSubtract = () => {
    setSelectedDate(selectedDate.subtract(1, 'd'))
    getData();
  }

  return (
    <Container className="schedule">
      <button onClick={handleSubtract}>-</button>
      {selectedDate && selectedDate.format('MMM D, YYYY')}
      <button onClick={handleAdd}>+</button>
      <Link to="/schedule"><p className="schedule-title">Book Your Schedule</p></Link>
      {schedules &&
        schedules.schedules &&
        schedules.schedules.map((schedule) => {
          return (
            <div key={schedule._id} className="schedule-item">
              <div className="item-title item-div">{schedule.title}</div>
              <div className="item-div"><p className="item">Date :  </p>{schedule.bookedDate}</div>

              <div className="item-div"><p className="item">Description :  </p>{schedule.description}</div>
            </div>
          );
        })}
    </Container>
  );
}
