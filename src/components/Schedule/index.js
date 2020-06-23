import React, { useState, useContext, useEffect } from "react";
import { Container, Button } from "@material-ui/core";
import "../../styles/Schedule.scss";
import { Link } from "react-router-dom";
import ScheduleDetails from "./ScheduleDetails";
import axios from "axios";
import UserContext from "../../context/UserContext";

export default function Schedule() {
  const [schedules, setSchedules] = useState();
  const { userData, setUserData } = useContext(UserContext);
  console.log("userData", userData);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:5000/api/schedules", {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        setSchedules(res.data);
      });
  };

  return (
    <Container className="schedule">
      <Link to="/schedule">Book Your Schedule</Link>

      {schedules &&
        schedules.schedules &&
        schedules.schedules.map((schedule) => {
          return (
            <div key={schedule._id}>
              <div>{schedule.bookedDate}</div>
              <div>{schedule.title}</div>
              <div>{schedule.description}</div>
            </div>
          );
        })}
    </Container>
  );
}
