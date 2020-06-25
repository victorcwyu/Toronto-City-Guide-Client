import React, { useState, useContext, useEffect } from "react";
import { Container} from "@material-ui/core";
import "../../styles/Schedule.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";

export default function Schedule() {
  const [schedules, setSchedules] = useState();
  const { userData, setUserData } = useContext(UserContext);
  console.log("userData", userData);
 
  

  useEffect(() => {
    getData();

  }, [schedules]);

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
      <Link to="/schedule"><p className="schedule-title">Book Your Schedule</p></Link>
           {schedules &&
        schedules.schedules &&
        schedules.schedules.map((schedule) => {
          return (
            <div key={schedule._id} className = "schedule-item">
               <div  className="item-title item-div">{schedule.title}</div>
              <div className="item-div"><p className="item">Date :  </p>{schedule.bookedDate}</div>
              
             <div className="item-div"><p className="item">Description :  </p>{schedule.description}</div>
            </div>
          );
        })}
    </Container>
  );
}
