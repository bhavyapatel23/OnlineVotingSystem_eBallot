import React, { useState, useEffect } from 'react';
import Form from './Form';
import { Link } from 'react-router-dom';
import './CreatePoll.css'
import { useCookies } from 'react-cookie';



function CreatePoll() {
  const [superuser, setSuperuser] = useState(false)
  const [cookies]=useCookies(['mytoken'])
  const finalcookie =cookies.mytoken

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
        console.log(superuser)


      })
      .catch(error => console.log(error));
  });

  return (
    <>
      {/* <PartyForm/> */}

      {superuser ? <Form /> : <div className="admin-access-message">
        Sorry !!!!<br></br>
        Only admin can access this page.<br></br>
        If you are voter then go to <Link to='/user'><button className='btn btn-primary'>Voter</button></Link>
      </div>}
    </>
  );
}



export default CreatePoll;
