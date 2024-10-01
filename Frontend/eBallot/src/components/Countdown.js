import React, { useState, useEffect } from 'react';

// Function to fetch parties from the backend
const fetchPartiesForPoll = async (pollId) => {
  
  
  try {
    const response = await fetch(`http://127.0.0.1:8000/parties_by_poll/${pollId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching parties:', error);
    return [];
  }
};

const Countdown = ({ startDate, startTime, endDate, endTime, pollId, onRemainingTimeChange }) => {
  const [remainingTime, setRemainingTime] = useState('');
  const [parties, setParties] = useState([]);
 

  useEffect(() => {
    const fetchParties = async () => {
      const partiesData = await fetchPartiesForPoll(pollId);
      setParties(partiesData);
     
    };

    fetchParties();
  }, [pollId]);

  useEffect(() => {
    let intervalId;

    const updateCountdown = () => {
      const now = new Date();
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      if (parties.length < 2) {
        const message = "Please add at least two parties.";
        setRemainingTime(message);
        onRemainingTimeChange(message);
        return;
      }

      if (now < startDateTime) {
        const message = "This Poll will start very soon.";
        setRemainingTime(message);
        onRemainingTimeChange(message);
        return;
      }

      const remainingTimeMs = endDateTime - now;

      if (remainingTimeMs <= 0) {
        const message = 'This Poll has ended!';
        setRemainingTime(message);
        onRemainingTimeChange(message);
        clearInterval(intervalId);
        return;
      }

      const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

      const timeString = `${days} days : ${hours} hours : ${minutes} minutes : ${seconds} seconds remaining.`;
      setRemainingTime(timeString);
      onRemainingTimeChange(timeString);
    };

   
    if ( parties.length >= 2) {
      updateCountdown();
      intervalId = setInterval(updateCountdown, 1000);
    } else if (parties.length < 2) {
      const message = "Please add at least two parties.";
      setRemainingTime(message);
      onRemainingTimeChange(message);
    }

    return () => clearInterval(intervalId);
  }, [startDate, startTime, endDate, endTime, pollId, parties]);

  return <h5>{remainingTime}</h5>;
};

export { fetchPartiesForPoll, Countdown };
