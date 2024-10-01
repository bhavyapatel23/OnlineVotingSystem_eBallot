import React from 'react';
import { Link } from 'react-router-dom';
import image1 from '../images/i_1-removebg-preview.png';
import createpollimage from '../images/freeonlinesurvey.png';
import adminimage from '../images/Create-Your-Poll-In-3-Easy-Steps-With-PollDeep-removebg-preview.png';
import voterimage from '../images/images-removebg-preview.png';
import resultimage from '../images/Mentimeter_Applications_Web_Live-Polling_HeroImage_2021__1_-removebg-preview.png';
import './landingpage.css'

function Home() {
  
  return (
    <>
      <div className='Main'>
        <div className='Main-content'>
          <div className="Maintitle">
            <h1>eBallot</h1>
            <h2>Cast Your Vote From Anywhere</h2>
          </div>
          
        </div>
        <div className='Main-Image'>
          <img src={image1} alt="Main visual" />
        </div>
      </div>
      <div className='component'>
        <div className='comp1'>
          <div className='img_com_1'>
            <img src={createpollimage} alt="Create Poll" />
          </div>
          <div className='content_com_1'>
            <h2>Create Poll</h2>
            <p>Admin can create poll easily by this Create Poll page.</p>
            <Link to='/createpoll'><button className='btn btn-lg btn-outline-secondary'>Create Poll</button></Link>
          </div>
        </div>
        <div className='comp2'>
          <div className='img_com_2'>
            <img src={adminimage} alt="Admin" />
          </div>
          <div className='content_com_2'>
            <h2>Admin</h2>
            <p>By using this admin page, admin can manage polls and parties.</p>
            <Link to='/admin'><button className='btn btn-lg btn-outline-secondary'>Admin</button></Link>
          </div>
        </div>
        <div className='comp3'>
          <div className='img_com_3'>
            <img src={voterimage} alt="Voter" />
          </div>
          <div className='content_com_3'>
            <h2>Voter</h2>
            <p>This page allows voters to see available polls and cast their vote from anywhere.</p>
            <Link to='/user'><button className='btn btn-lg btn-outline-secondary'>Voter</button></Link>
          </div>
        </div>
        <div className='comp4'>
          <div className='img_com_4'>
            <img src={resultimage} alt="Result" />
          </div>
          <div className='content_com_4'>
            <h2>Result</h2>
            <p>Voter and Admin can see live results on this result page.</p>
            <Link to='/result'><button className='btn btn-lg btn-outline-secondary'>Result</button></Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
