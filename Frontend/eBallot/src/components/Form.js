import React, { useState, useEffect } from 'react';
import Functionality from '../Functionality';
import {useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Form() {
    const [cookies]=useCookies(['mytoken'])
    const finalcookie = cookies.mytoken
    const [pollTitle, setPollTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const location=useLocation()
    const Poll=location.state
    

    const [error, setError] = useState('');

    useEffect(() => {
        if (Poll) {
            setPollTitle(Poll.poll_title);
            setStartDate(Poll.poll_start_date);
            setEndDate(Poll.poll_end_date);
            setStartTime(Poll.poll_start_time);
            setEndTime(Poll.poll_end_time);
            // setAddparty()
        }
    }, [Poll]);



    const EditPoll = () => {
        if (Poll?.id) {
            Functionality.EditPoll(Poll.id, { pollTitle, startDate, endDate, startTime, endTime },finalcookie)
                .then(() => {
                    alert('Poll updated successfully!');
                    window.location.href='/admin'

                })
                .catch(err => setError('Failed to update poll.')); // Handle errors
        }
    };

    const insertPoll = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (Poll?.id) {
                EditPoll();
            } else {
                Functionality.InsertPoll({ pollTitle, startDate, startTime, endDate, endTime },finalcookie)
                    .then(() => {
                        alert('Poll inserted successfully!');
                        resetForm();
                        window.location.href='/admin'

                    })
                    .catch(err => setError('Faild to insert Poll')); // Handle errors
            }
        }
    };

    const validateForm = () => {
        if (!pollTitle || !startDate || !endDate || !startTime || !endTime) {
            setError('Please fill all required fields.');
            return false;
        }
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        if (endDateTime <= startDateTime) {
            setError('End date and time must be after start date and time.');
            return false;
        }

        setError('');
        return true;
    };



    const resetForm = () => {
        setPollTitle('');
        setStartDate('');
        setEndDate('');
        setStartTime('');
        setEndTime('');

        setError('');
    };

    return (
        <div className="parent">
        <div className="createpoll_content">
        <div className="container-fluid p-5">
            <form encType="multipart/form-data" method='post'>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="pollTitle" className="form-label">Poll Title:</label>
                    <input
                        type="text"
                        id="pollTitle"
                        name="pollTitle"
                        className="form-control"
                        value={pollTitle}
                        onChange={e => setPollTitle(e.target.value)}
                        required
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="form-control"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="form-control"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        required
                    />
                </div>
             
                <div className="mb-3">
                    <label htmlFor="startTime" className="form-label">Start Time:</label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        className="form-control"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="endTime" className="form-label">End Time:</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        className="form-control"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        required
                    />
                </div>

                {Poll?.id ? (
                    <button type="button" onClick={EditPoll} className="btn btn-primary">Edit Poll</button>
                ) : (
                    <button type="submit" onClick={insertPoll} className="btn btn-primary">Insert Poll</button>
                )}
            </form>
        </div>
        </div>
        </div>
    );
}

export default Form;
