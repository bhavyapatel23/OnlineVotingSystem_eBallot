import React, { useState, useEffect } from 'react';
import { Countdown, fetchPartiesForPoll } from './Countdown';
import { Link, useNavigate } from 'react-router-dom';
import Functionality from '../Functionality';
import './Admin.css';
import Form from './Form';
import { useCookies } from 'react-cookie';

function Admin() {
  const [Polls, setPolls] = useState([]);
  const [superuser, setSuperuser] = useState(false);
  const [editpoll, setEditPoll] = useState(null);
  const [editparty, setEditParty] = useState(null);
  const [selectedPollParties, setSelectedPollParties] = useState(null);
  const [remainingTime, setRemainingTime] = useState({}); // Track remaining time for each pollc
  const [cookies]=useCookies(['mytoken'])
  const finalcookie = cookies.mytoken
  let navigate = useNavigate();

  useEffect(() => {
    
    
    
    fetch('http://127.0.0.1:8000/token_user/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${finalcookie}`
      }
    })
      .then(resp => resp.json())
      .then(data => {
        setSuperuser(data.is_superuser);
      })
      .catch(error => console.log(error));
  }, []);

  const Editpoll = (poll) => {
    setEditPoll(poll);
    navigate('editpoll', { state: poll });
  };

  const Editparty = (party) => {
    setEditParty(party);
    navigate('editparty', { state: party });
  };

  const deletePoll = (poll) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this poll?');
    if (confirmDelete) {
      Functionality.DeletePoll(poll.id,finalcookie);
      const newPolls = Polls.filter(P => P.id !== poll.id);
      setPolls(newPolls);
    }
  };

  const Addparty = () => {
    navigate('addparty');
  };

  const publishPoll = async (poll) => {
    const parties = await fetchPartiesForPoll(poll.id);
    if (parties.length >= 2) {
      const confirmPublish = window.confirm('Are you sure you want to publish this poll? After publishing, you will not be able to update this poll.');
      if (confirmPublish) {
        const data = { is_published: true };
        const poll_id = poll.id;

        fetch(`http://127.0.0.1:8000/polls/${poll_id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${finalcookie}`
          },
          body: JSON.stringify(data),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(updatedPoll => {
            setPolls(prevPolls => prevPolls.map(p => p.id === updatedPoll.id ? updatedPoll : p));
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    } else {
      alert('Please add at least two parties');
    }
  };

  const handlePollClick = async (poll) => {
    if (selectedPollParties && selectedPollParties.pollId === poll.id) {
      setSelectedPollParties(null);
    } else {
      const parties = await fetchPartiesForPoll(poll.id);
      setSelectedPollParties({ pollId: poll.id, parties });
    }
  };

  const deleteparty = (party) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this party?');
    if (confirmDelete) {
      Functionality.DeleteParty(party.id,finalcookie);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (superuser) {
      fetch('http://127.0.0.1:8000/polls/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${finalcookie}`
        }
      })
        .then(resp => resp.json())
        .then(resp => setPolls(resp))
        .catch(error => console.log(error));
    }
  }, [superuser]);

  const updateRemainingTime = (time, pollId) => {
    setRemainingTime(prev => ({ ...prev, [pollId]: time }));
  };

  if (!superuser) {
    return (
      <div className="admin-access-message">
        Sorry !!!!<br />
        Only admin can access this page.<br />
        If you are a voter then go to <Link to='/user'><button className='btn btn-primary'>Voter</button></Link>
      </div>
    );
  }

  return (
    <>
      {Polls.map((poll) => {
        const isVoteDisabled = remainingTime[poll.id] === 'This Poll has ended!' || remainingTime[poll.id] === 'This Poll will start very soon.';

        return (
          <div className='poll' key={poll.id}>
            <div className='poll-content'>
              <h3>{poll.poll_title}</h3>
              <Countdown
                startDate={poll.poll_start_date}
                startTime={poll.poll_start_time}
                endDate={poll.poll_end_date}
                endTime={poll.poll_end_time}
                pollId={poll.id}
                onRemainingTimeChange={(time) => updateRemainingTime(time, poll.id)} // Pass callback
              />
            </div>

            {!poll.is_published && (
              <div className='poll-button'>
                <button onClick={() => Addparty()} className='btn btn-primary poll-btn'>AddParty</button>
                <button onClick={() => Editpoll(poll)} className='btn btn-success poll-btn'>Edit</button>
                <button onClick={() => deletePoll(poll)} className='btn btn-danger poll-btn'>Delete</button>
                <button onClick={() => publishPoll(poll)} className='btn btn-info poll-btn' >Publish</button>
                <button onClick={() => handlePollClick(poll)} className='btn btn-secondary poll-btn'>More</button>
              </div>
            )}

            {selectedPollParties && selectedPollParties.pollId === poll.id && (
              <div className='poll-parties mt-3'>
                <h4>Parties:</h4>

                {selectedPollParties.parties.map(party => (
                  <div key={party.id} className='mt-2' id='pdetails'>
                    <div className="mt-2" id='partydetails'>
                      <div className="list-group-item">
                        <h5>Party: {party.partyname}</h5>
                        <p>Candidate: {party.candidatename}</p>
                      </div>
                      <div>Sign:
                        {party.sign && <img src={party.sign} alt={party.partyname + ' sign'} style={{ width: '100px', height: 'auto' }} />}
                      </div>
                    </div>
                    <div id='btns'>
                      <button onClick={() => Editparty(party)} className='btn btn-success'>Edit</button>
                      <button onClick={() => deleteparty(party)} className='btn btn-danger'>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {editpoll && <Form Poll={editpoll} />}
      {/* {editparty && <PartyForm Party={editparty}/>} */}
    </>
  );
}

export default Admin;
