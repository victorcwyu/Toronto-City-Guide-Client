import React, { useState, useContext, useEffect } from "react";
import { Container } from "@material-ui/core";
import "../../styles/Schedule.scss";
import axios from "axios";
import UserContext from "../../context/UserContext";
import moment from "moment"
import ScheduleDetails from "./ScheduleDetails"

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
  root: {
    // border: '.2em solid #01050e',
    width: '80%',
    boxShadow: '10px 10px 5px 0px rgba(0, 0, 0, 0.75)',
    padding: '20px',
    margin: '100px auto',
    backgroundColor: '#287ac3',
  }
})

export default function Schedule() {
  const classes = useStyles();


  const { userData } = useContext(UserContext);

  const [schedules, setSchedules] = useState();
  const [selectedDate, setSelectedDate] = useState(moment().zone(4))

  useEffect(() => {
    getData();
  }, [userData.wtf]);

  const getData = () => {
    axios
      .post("https://toronto-city-travel-guide.herokuapp.com/api/schedules/get", {
        selectedDate: selectedDate.format('YYYY-MM-DD')
      }, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        // setUserData({...userData.user, schedules: res.data});
        // setUserData({ ...userData, retrievedSchedules: res.data });
        // console.log(res.data)
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

  const handleDelete = (e) => {
    e.preventDefault();
    console.log(e.target.value)
    axios
      .delete("https://toronto-city-travel-guide.herokuapp.com/api/schedules/deleteItem", {
        data: {scheduleId: e.target.value},
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        setSchedules(res.data.newSchedule)
      });
  }

  return (
    <>
    <ScheduleDetails/>
      <Container className={classes.root}>
        <div className="schedule-title">
          {/* <h2>Schedule for:</h2> */}
          {/* {selectedDate && selectedDate.format('MMM D, YYYY')} */}
          {/* {selectedDate && selectedDate.format('MMM D, YYYY')} */}
          <button
            onClick={handleSubtract}
            className="date-selector"
          >
            <p>&#8592;</p>
          </button>
          {selectedDate && selectedDate.format('MMM D, YYYY')}
          <button 
          className="date-selector"
          onClick={handleAdd}
          >
            <p>&#8594;</p>
          </button>
        </div>



      {schedules &&
        schedules.schedules.map((schedule) => {

          console.log("HIII", (schedule.bookedDate).slice(11, 17))
          
          return (
            <div key={schedule.id} className="schedule-item">

              <div className="item-title item-div">{schedule.title} @ {schedule.bookedDate.slice(11, 17)}</div>

              {/* <div className="item-div"><p className="item">Date :  </p>{schedule.bookedDate}</div> */}

              <div className="item-div">{schedule.description}</div>
            <button id ="scheduleButton" value={schedule.id} onClick={handleDelete}>Remove</button>
            </div>
          );
        })}
    </Container>
    </>
  );
}
