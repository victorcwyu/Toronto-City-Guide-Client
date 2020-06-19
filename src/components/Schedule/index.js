import React from "react";
import { Container, Button } from "@material-ui/core";
import "../../styles/Schedule.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ScheduleDetails from "./ScheduleDetails";
export default function Schedule() {
  return (
         <Container className="schedule">
        <Link to="/schedule">Book Your Schedule</Link>
      </Container>
   
    
  );
}
