import React, { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {ToastContainer , toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../utils';


function Login() {
  const [loginInfo,setLoginInfo]=useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate();
  const handleChange=(e)=>{
    const {name,value}=e.target;
    console.log(name,value);
    const copyLoginInfo={...loginInfo};
    copyLoginInfo[name]=value;
    setLoginInfo(copyLoginInfo);
    console.log('loginInfo->',loginInfo)
  }

  const handleLogin= async (e)=>{
        e.preventDefault();
        const {email,password}=loginInfo;
        if(!email || !password){
            return handleError('email and password are required')
        }
        try {
            const url = 'http://localhost:8080/auth/login';
            console.log('📤 Sending signup info to backend:', loginInfo);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });

            console.log('📥 Received raw response:', response);

            const result = await response.json();
            console.log('✅ Parsed result:', result);

            const { success, message, jwtToken, name, error } = result;

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token',jwtToken);
                localStorage.setItem('loggedInUser',name)
                setTimeout(() => navigate('/home'), 1500);
            } else if (error?.details) {
                handleError(error.details[0].message);
            } else {
                handleError(message);
            }
        } catch (err) {
            console.error('❌ Error in signup request:', err);
            handleError('Something went wrong. Check console.');
         }
  }

  return (
    <div className='container'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
             <div>
                <label htmlFor='email'>Email</label>
                <input onChange={handleChange} type="email" name='email' autoFocus placeholder='Enter your email' value={loginInfo.email}/>
            </div>
             <div>
                <label htmlFor='password'>Password</label>
                <input onChange={handleChange} type="password" name='password' autoFocus placeholder='Enter your password' value={loginInfo.password}/>
            </div>
            <button type='login'>Login</button>
            <span>Don't have an account ?
                <Link to='/signup'>Signup</Link>
            </span>
        </form>
        <ToastContainer/>
    </div>
  )
}

export default Login
