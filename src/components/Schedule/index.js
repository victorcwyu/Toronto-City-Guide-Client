import React, { useState, useContext, useEffect } from "react";
import { Container } from "@material-ui/core";
import "../../styles/Schedule.scss";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { date } from "date-fns/locale/af";
import moment from "moment"
import ScheduleDetails from "./ScheduleDetails"

export default function Schedule() {
  const { userData, setUserData } = useContext(UserContext);

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
        setUserData({ ...userData, retrievedSchedules: res.data });
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
    <Container className="schedule">
      <button 
      onClick={handleSubtract}
      className="date-selector"
      >
        Prev
      </button>
      {selectedDate && selectedDate.format('MMM D, YYYY')}
      <button 
      className="date-selector"
      onClick={handleAdd}
      >
        Next
      </button>
      {schedules &&
        schedules.schedules.map((schedule) => {
          return (
            <div key={schedule.id} className="schedule-item">
              <div className="item-title item-div">{schedule.title}</div>
              <div className="item-div"><p className="item">Date :  </p>{schedule.bookedDate}</div>

              <div className="item-div"><p className="item">Description :  </p>{schedule.description}</div>
            <button value={schedule.id} onClick={handleDelete}>DELETE</button>
            </div>
          );
        })}
    </Container>
    </>
  );
}
