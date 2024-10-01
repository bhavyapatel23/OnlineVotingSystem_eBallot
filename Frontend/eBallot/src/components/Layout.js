import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './Layout.css'; // Import the CSS for the layout if needed

function Layout({ children }) {
  const [, , removeCookie] = useCookies(['mytoken']);
  const navigate = useNavigate();

  const logoutbtn = () => {
    removeCookie('mytoken');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/home">eBallot</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/home" activeclassname="active">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/createpoll" activeclassname="active">Create Poll</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin" activeclassname="active">Admin</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/user" activeclassname="active">Voter</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/result" activeclassname="active">Result</NavLink>
              </li>
            </ul>
            <div className='btns'>
              <button className="btn btn-outline-secondary" type="button" onClick={logoutbtn}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {children}
      </main>
    </>
  );
}

export default Layout;
