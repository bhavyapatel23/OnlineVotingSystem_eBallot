import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Functionality from '../Functionality';
import './register.css'; // Import the CSS file

function Register() {
    const [election_id, setElection_id] = useState('');
    const [password, setPassword] = useState('');
    const [mobile_no, setMobile_no] = useState('');
    const [errors, setErrors] = useState({});
    const [setToken] = useCookies(['mytoken']);
    let navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Validate election_id
        const electionIdRegex = /^[A-Z]{3}\d{7}$/;
        if (!election_id.trim()) {
            newErrors.election_id = 'Election ID is required';
        } else if (!electionIdRegex.test(election_id)) {
            newErrors.election_id = 'Election ID must start with 3 capital letters followed by 7 digits';
        }

        // Validate password
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        // Validate mobile_no
        if (!mobile_no.trim()) {
            newErrors.mobile_no = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(mobile_no)) {
            newErrors.mobile_no = 'Mobile number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const registerBtn = () => {
        if (validateForm()) {
            Functionality.RegisterUser({ election_id, mobile_no, password })
                .then(() => {
                    Functionality.LoginUser({ election_id, password })
                        .then(resp => {
                            setToken('mytoken', resp.token);
                            navigate('/home'); // Ensure redirection happens here as well
                        })
                        .catch(error => {
                            console.log(error)
                            }
                    );
                })
                .catch(error => {
                    console.log(error)
                    alert('This election id already exists')
                });
        }
    };

    const logi = () => {
        navigate('/login');
    };

    return (
        <div className='registerdiv'>
            <h1 id='registertitle'>Register</h1>
            <div className='m-2'>
                <label htmlFor='election_id' className='form-label'>Election ID</label>
                <input
                    type='text'
                    className='form-control'
                    id='election_id'
                    value={election_id}
                    placeholder='Enter your election id'
                    onChange={e => setElection_id(e.target.value)}
                />
                {errors.election_id && <div className='error'>{errors.election_id}</div>}
            </div>
            <div className='m-2'>
                <label htmlFor='mobile_no' className='form-label'>Mobile No</label>
                <input
                    type='text'
                    className='form-control'
                    id='mobile_no'
                    value={mobile_no}
                    placeholder='Enter your mobile no'
                    onChange={e => setMobile_no(e.target.value)}
                />
                {errors.mobile_no && <div className='error'>{errors.mobile_no}</div>}
            </div>
            <div className='m-2'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={password}
                    placeholder='Enter your password'
                    onChange={e => setPassword(e.target.value)}
                />
                {errors.password && <div className='error'>{errors.password}</div>}
            </div>
            <button onClick={registerBtn} className='btn btn-primary' id='registerbtn'>Register</button>
            <h5>If you have an account <button className='btn btn-primary' onClick={logi}>Login</button></h5>
        </div>
    );
}

export default Register;
