import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEvent = () => {

    const [eventName, setEventName] = useState('');
    const [date, setDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();

    const handleAddEvent = (e) => {
        e.preventDefault();
        // console.log(eventName, date, fromTime, toTime);

        axios.post('http://localhost:3001/event/add', {
            eventName,
            date,
            fromTime,
            toTime,
            userId
        })
        .then((response) => {
            console.log(response);
            setEventName('');
            setDate('');
            setFromTime('');
            setToTime('');
            setUserId('');
            navigate('/home');
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            // console.log("token in dashboard useEffect", token);
            axios.post('http://localhost:3001/user/validateToken', {token})
            .then((response) => {
                // console.log(response from validate token api);
                setUserId(response.data.user._id);
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
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
            <h2><center>Add Event</center></h2>
            <form onSubmit={handleAddEvent}>
                {/* {error &&
                    <div className="alert alert-danger alert-dismissible">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAlert}></button>
                        <strong>Error!</strong> {error}
                    </div>
                    } */}

                <div className="mb-3">
                    <label htmlFor="event-name">
                        <strong>Event Name</strong>
                    </label>
                    <input type="text"
                        required
                        placeholder='Enter Event Name' 
                        autoComplete='off'
                        id="event-name"
                        name='event-name' 
                        className='form-control rounded-0' 
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="date">
                        <strong>Date</strong>
                    </label>
                    <input type="date"
                        required
                        id="date"
                        name='date' 
                        className='form-control rounded-0'
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="from-time">
                        <strong>From</strong>
                    </label>
                    <input type="time"
                        required
                        id="from-time"
                        name='from-time' 
                        className='form-control rounded-0'
                        onChange={(e) => setFromTime(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="to-time">
                        <strong>To</strong>
                    </label>
                    <input type="time"
                        required
                        id="to-time"
                        name='to-time' 
                        className='form-control rounded-0'
                        onChange={(e) => setToTime(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">
                    Add Event
                </button>
                </form>
        </div>
    </div>
    </>
    
  )
}

export default AddEvent;