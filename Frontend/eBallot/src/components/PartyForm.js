import React, { useEffect, useState } from 'react';
import Functionality from '../Functionality';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './PartyForm.css'


function PartyForm() {
  const [cookies]=useCookies(['mytoken'])
  const finalcookie = cookies.mytoken
  const [Polls, setPolls] = useState([]);
  const [partyName, setPartyName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [sign, setSign] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const location = useLocation()
  const part = location.state
  console.log(part)

  useEffect(() => {
    if (part) {

      setSelectedPoll(part.poll);
      setPartyName(part.partyname);
      setCandidateName(part.candidatename);

    }
  }, [part]);

  const EditParty = () => {
    if (part?.id) {
      Functionality.EditParty(part.id, { selectedPoll, partyName, candidateName, sign },finalcookie)
        .then(() => {
          alert('Party updated successfully!');
          window.location.href = '/admin'

        })
        .catch(err => setErrorMsg('Failed to update party.')); // Handle errors
    }
  };

  const addParty = () => {
    // Clear previous messages
    setErrorMsg('');

    // Find the selected poll and get its ID
    const selectedPollObj = Polls.find(poll => poll.poll_title === selectedPoll);

    if (!selectedPollObj) {
      setErrorMsg('Selected poll is not valid!');
      return;
    }

    const partypollid = selectedPollObj.id;

    if (partyName && candidateName && sign && partypollid) {
      // Assuming sign is a file and needs to be handled appropriately
      const newParty = { partyName, candidateName, sign, partypollid };

      Functionality.Addparty(newParty,finalcookie)
        .then(() => {
          // Display success message in a popup
          alert('Party added successfully!');
          window.location.href='/admin'
        })
        .catch(error => {
          console.error('Error adding party:', error);
          setErrorMsg('Error adding party. Please try again.');
        });
    } else {
      setErrorMsg('All fields are required!');
    }
  };

  const handleFileChange = (e) => {
    setSign(e.target.files[0]);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/polls/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${finalcookie}`

      }
    })
      .then(resp => resp.json())
      .then(resp => setPolls(resp))
      .catch(error => console.error('Error fetching polls:', error));
  }, [finalcookie]);

  return (
    <div className="parent">
    <div className="partyform_content">
      <div className="m-5">
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
  
        <select
          className="form-select"
          aria-label="Select Poll"
          required
          value={selectedPoll}
          onChange={e => setSelectedPoll(e.target.value)}
        >
          <option value="" disabled>Select Poll</option>
          {Polls.map((poll) => (
            <option key={poll.id} value={poll.poll_title}>{poll.poll_title}</option>
          ))}
        </select>
  
        <div className="mt-3">
          <label htmlFor='partyName' className="form-label">Party Name:</label>
          <input
            type="text"
            id='partyName'
            name='partyName'
            className="form-control"
            value={partyName}
            onChange={e => setPartyName(e.target.value)}
            required
          />
        </div>
  
        <div className="mt-3">
          <label htmlFor='candidateName' className="form-label">Candidate Name:</label>
          <input
            type="text"
            id='candidateName'
            name='candidateName'
            className="form-control"
            value={candidateName}
            onChange={e => setCandidateName(e.target.value)}
            required
          />
        </div>
  
        <div className="mt-3">
          <label htmlFor='sign' className="form-label">Choose Sign:</label>
          <input
            type="file"
            id='sign'
            name='sign'
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>
  
        {part?.id ? (
          <button type="button" onClick={EditParty} className="btn btn-primary">Edit Party</button>
        ) : (
          <button type="submit" onClick={addParty} className="btn btn-primary" id="addparty_btn">Add Party</button>
        )}
      </div>
    </div>
  </div>
  
  );
}

export default PartyForm;
