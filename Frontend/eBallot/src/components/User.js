import React, { useEffect, useState } from 'react';
import { Countdown, fetchPartiesForPoll } from './Countdown';
import Functionality from '../Functionality';
import { useCookies } from 'react-cookie';

function User() {
  const [polls, setPolls] = useState([]);
  const [votedpolls, setVotedpolls] = useState([]);
  const [selectedPollParties, setSelectedPollParties] = useState(null);
  const [uid, setUid] = useState(null);
  const [remainingTime, setRemainingTime] = useState({}); // Track remaining time for each poll
  const [cookies]=useCookies(['mytoken'])
  const finalcookie = cookies.mytoken;

  const handlePollClick = async (poll) => {
    if (selectedPollParties && selectedPollParties.pollId === poll.id) {
      setSelectedPollParties(null);
    } else {
      const parties = await fetchPartiesForPoll(poll.id);
      setSelectedPollParties({ pollId: poll.id, parties });
    }
  };

  const handleVote = async (party, poll) => {
    const confirmVote = window.confirm('Are you sure for your vote?');
    if (confirmVote) {
      await Functionality.HandleVote({
        candidatename: party.candidatename,
        partyname: party.partyname,
        poll_title: poll.poll_title
      });
      await Functionality.StoreVote({ userID: uid, pollTitle: poll.poll_title },finalcookie);
      window.location.reload();
    }
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/user_votes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${finalcookie}`
      }
    })
      .then(resp => resp.json())
      .then(resp => {
        const arrayForm = Array.isArray(resp) ? resp : [resp];
        setVotedpolls(arrayForm);
      })
      .catch(error => console.log(error));
  }, [polls, uid,finalcookie]);

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
    
    

    fetch('http://127.0.0.1:8000/token_user/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${finalcookie}`
      }
    })
      .then(resp => resp.json())
      .then(data => {
        setUid(data.userID);
      })
      .catch(error => console.log(error));
  }, [polls,finalcookie]);

  const updateRemainingTime = (time, pollId) => {
    setRemainingTime(prev => ({ ...prev, [pollId]: time }));
  };

  return (
    <>
      {polls.map((poll) => {
        const hasVoted = votedpolls.some(voted => voted.pollTitle === poll.poll_title && voted.userID === uid);
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
            <div>
              <button
                onClick={() => handlePollClick(poll)}
                className='btn btn-success'
                disabled={hasVoted || isVoteDisabled} // Disable if the user has voted or time is up
              >
                <span style={{ color: hasVoted ? 'red' : 'inherit', fontWeight: hasVoted ? 'bold' : 'normal' }}>
                  {hasVoted ? 'Voted' : 'Vote'}
                </span>
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
                      <div>Sign:
                        {party.sign && <img src={party.sign} alt={party.partyname + ' sign'} style={{ width: '100px', height: 'auto' }} />}
                      </div>
                    </div>
                    <div id='btns'>
                      <button
                        onClick={() => handleVote(party, poll)}
                        className='btn btn-success'
                        disabled={hasVoted || isVoteDisabled} // Disable if the user has voted or time is up
                      >
                        {hasVoted ? 'Voted' : 'Vote'}
                      </button>
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

export default User;
