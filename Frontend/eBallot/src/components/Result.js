import React, { useEffect, useState } from 'react';
import { Countdown, fetchPartiesForPoll } from './Countdown';
import { useCookies } from 'react-cookie';

function Result() {
  const [cookies]=useCookies(['mytoken'])
  const finalcookie = cookies.mytoken
  const [polls, setPolls] = useState([]);
  const [selectedPollParties, setSelectedPollParties] = useState(null);
  const [votes, setVotes] = useState([]);
  const [, setRemainingTime] = useState({}); // Track remaining time for each poll

  const handlePollClick = async (poll) => {
    if (selectedPollParties && selectedPollParties.pollId === poll.id) {
      // Toggle display of parties if already selected
      setSelectedPollParties(null);
    } else {
      // Fetch and display parties for the selected poll
      const parties = await fetchPartiesForPoll(poll.id);
      setSelectedPollParties({ pollId: poll.id, parties });
    }
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/polls/published/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${finalcookie}`
      }
    })
      .then(resp => resp.json())
      .then(resp => setPolls(resp))
      .catch(error => console.log(error));
  }, [finalcookie]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/votes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${finalcookie}`
      }
    })
      .then(resp => resp.json())
      .then(resp => setVotes(resp))
      .catch(error => console.log(error));
  }, [finalcookie]);

  const getVoteCount = (partyname, candidatename) => {
    return votes.filter(vote => vote.partyname === partyname && vote.candidatename === candidatename).length;
  };

  const updateRemainingTime = (time, pollId) => {
    setRemainingTime(prev => ({ ...prev, [pollId]: time }));
  };

  return (
    <>
      {polls.map((poll) => {
       

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
            <div>
              <button onClick={() => handlePollClick(poll)} className='btn btn-success'>
                {selectedPollParties && selectedPollParties.pollId === poll.id ? 'Hide Result' : 'Show Result'}
              </button>
            </div>
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
                      <div style={{ backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '5px', height: '5vh' }}>
                        Votes: {getVoteCount(party.partyname, party.candidatename)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default Result;
