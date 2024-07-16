import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Dashboard = () => {

  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const handleAddEvent = () => {
    navigate('/add-event');
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }
  
  useEffect(() => {
      const token = localStorage.getItem('token');
      if(token){
          // console.log("token in dashboard useEffect", token);
          axios.post('http://localhost:3001/user/validateToken', {token})
          .then((response) => {
              // console.log("response from validate token api", response); // response from validate token api;
              const userId = response.data.user._id;
              const userName = response.data.user.name;
              setUserId(userId);
              setUserName(userName);
              // console.log("userId", userId);
              // console.log("userName", userName);

              return axios.get(`http://localhost:3001/event/getEvents/${userId}`);
          })
          .then((response) => {
              console.log("response from get events api", response);
              // console.log("events data", response.data)
              setEvents(response.data.events);
          })
          .catch((error) => {
              // console.log("token validation error");
              localStorage.removeItem('token');
              navigate('/login');
          });
      }
      else {
          navigate('/login');
      }
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container-fluid">
          <a className="navbar-brand px-1" href="http://localhost:5173/home">Schedule App</a>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {userName}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" onClick={handleLogout}>Logout</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
        <p style={{ fontSize: '22px', marginTop: '15px', marginRight: '20px', marginLeft: '40px'}}>My events (<i>{events.length}</i>)</p>
        <button className="btn btn-primary"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>
      <div className="my-events">
        <div className="card-container">
          {events.map((event) => (
              <div key={event._id} className="card">
                <p><b>{event.eventName}</b></p>
                <p>{event.date}</p>
                <p>{event.fromTime} - {event.toTime}</p>
            </div>
          ))}
        </div>
      </div>
    </>

  )
}

export default Dashboard;