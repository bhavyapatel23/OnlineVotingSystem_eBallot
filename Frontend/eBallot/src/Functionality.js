export default class Functionality {
   
    static async EditPoll(poll_id, bodyy,finalcookie) {
       
        try {
            console.log(bodyy)

            const data = {
                poll_start_date: bodyy.startDate,
                poll_start_time: bodyy.startTime,
                poll_end_date: bodyy.endDate,
                poll_end_time: bodyy.endTime,
                poll_title: bodyy.pollTitle,
            };

            const response = await fetch(`http://127.0.0.1:8000/polls/${poll_id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const result = await response.json(); // assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
    }

    static async InsertPoll(bodyy,finalcookie) {
        try {
            const data = {
                poll_start_date: bodyy.startDate,
                poll_start_time: bodyy.startTime,
                poll_end_date: bodyy.endDate,
                poll_end_time: bodyy.endTime,
                poll_title: bodyy.pollTitle,
            };

            const response = await fetch(`http://127.0.0.1:8000/polls/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const result = await response.json(); // assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
    }
    static async DeletePoll(poll_id,finalcookie){
        try {

            const response = await fetch(`http://127.0.0.1:8000/polls/${poll_id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                  
                }
              
            });

            if (!response.ok) {
                const errorText = await response.text();  
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

        } catch (error) {
            console.error('Error:', error);
            throw error; 
        }

    }
    static async Addparty(bodyy,finalcookie) {
    
        try {
            // Create a FormData object
            const formData = new FormData();
            formData.append('poll',bodyy.partypollid)
            formData.append('partyname', bodyy.partyName);
            formData.append('candidatename', bodyy.candidateName);
    
            // Append the file as a Blob
            if (bodyy.sign instanceof File) {
                formData.append('sign', bodyy.sign); // `sign` should be a File object
            } else {
                throw new Error('Invalid file object for "sign".');
            }
    
            // Send the FormData object
            const response = await fetch(`http://127.0.0.1:8000/partys/`, {
                method: 'POST',
               
                body: formData, // FormData handles the Content-Type header
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
    
            const result = await response.json(); // Assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
       
    }
    static async DeleteParty(party_id,finalcookie){
        try {

            const response = await fetch(`http://127.0.0.1:8000/partys/${party_id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    
                }
              
            });

            if (!response.ok) {
                const errorText = await response.text();  
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

        } catch (error) {
            console.error('Error:', error);
            throw error; 
        }

    }
    static async EditParty(party_id, bodyy,finalcookie) {
        try {
            console.log(bodyy)

            const formData = new FormData();
            formData.append('poll',bodyy.selectedPoll)
            formData.append('partyname', bodyy.partyName);
            formData.append('candidatename', bodyy.candidateName);
    
            // Append the file as a Blob
            if (bodyy.sign instanceof File) {
                formData.append('sign', bodyy.sign); // `sign` should be a File object
            } else {
                throw new Error('Invalid file object for "sign".');
            }

            const response = await fetch(`http://127.0.0.1:8000/partys/${party_id}/`, {
                method: 'PUT',
               
                body:formData,
            });

            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const result = await response.json(); // assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
    }
    static async HandleVote(bodyy,finalcookie) {
        try {
            const data = {
               candidatename:bodyy.candidatename,
               partyname:bodyy.partyname,
               poll_title:bodyy.poll_title,
            };

            const response = await fetch(`http://127.0.0.1:8000/votes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const result = await response.json(); // assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
    }
    static async LoginUser(bodyy) {
        try {
            const data={
                election_id:bodyy.election_id,
                password:bodyy.password

            }
            const response = await fetch(`http://127.0.0.1:8000/auth/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const result = await response.json(); // assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
    }
    
    static async RegisterUser(bodyy) {
        try {
            const data={
                election_id:bodyy.election_id,
                mobile_no:bodyy.mobile_no,
                password:bodyy.password

            }
            const response = await fetch(`http://127.0.0.1:8000/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const result = await response.json(); // assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
    }
    static async StoreVote(bodyy,finalcookie) {
        try {
            const data = {
              userID:bodyy.userID,
              pollTitle:bodyy.pollTitle
            };

            const response = await fetch(`http://127.0.0.1:8000/user_votes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text(); // or response.json() depending on your API
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const result = await response.json(); // assuming the response is JSON
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw error if needed
        }
    }
    
    
}

    