import React, { useState, useEffect } from 'react';
import Functionality from '../Functionality';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [election_id, setElection_id] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useCookies(['mytoken']);
    const [errors, setErrors] = useState({});
    let navigate = useNavigate();

    useEffect(() => {
        // Clear form fields when component mounts
        setElection_id('');
        setPassword('');
        
        // Check for token and navigate if already logged in
        if (token['mytoken']) {
            console.log(token['mytoken']);
            navigate('/home');
        }
    }, [token, navigate]);
    const newErrors = {};
    const validateForm = () => {
        
        
        // Election ID validation
        if (!election_id.trim()) {
            newErrors.election_id = 'Election ID is required';
        } else if (!/^[A-Z]{3}\d{7}$/.test(election_id)) {
            newErrors.election_id = 'Invalid Election ID ';
        }

        // Password validation
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const loginBtn = () => {
        if (validateForm()) {
            Functionality.LoginUser({ election_id, password })
                .then(resp => {
                    setToken('mytoken', resp.token);
                    navigate('/home');
                })
                .catch(error => {
                   alert('Invalid Election ID or Invalid Password')
                    console.log(error);
                   
                    
                    
                });
        }
        
    };

    const register = () => {
        navigate('/register');
    };

    return (
        <div className='logindiv'>
            <h1 id='logintitle'>Login</h1>
            <div className='m-4'>
                <label htmlFor='election_id' className='form-label'>Election ID</label>
                <input
                    type='text'
                    className='form-control'
                    id='election_id'
                    value={election_id}
                    placeholder='Enter your election id'
                    onChange={e => setElection_id(e.target.value)}
                    autoComplete='off'
                />
                {errors.election_id && <div className='error'>{errors.election_id}</div>}
            </div>
            <div className='m-4'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    value={password}
                    placeholder='Enter your password'
                    onChange={e => setPassword(e.target.value)}
                    autoComplete='off'
                />
                {errors.password && <div className='error'>{errors.password}</div>}
            </div>
            <button onClick={loginBtn} className='btn btn-primary' id='loginbtn'>Login</button>
            <h5>If you don't have an account <button className='btn btn-primary' onClick={register}>Register</button></h5>
        </div>
    );
}

export default Login;
