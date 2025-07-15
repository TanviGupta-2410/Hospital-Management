import React, { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {ToastContainer , toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../utils';


function Signup() {
  const [signupInfo,setSignInfo]=useState({
    name: '',
    email: '',
    password: ''
  })
  const navigate = useNavigate();
  const handleChange=(e)=>{
    const {name,value}=e.target;
    console.log(name,value);
    const copySignupInfo={...signupInfo};
    copySignupInfo[name]=value;
    setSignInfo(copySignupInfo);
    console.log('loginInfo->',signupInfo)
  }

  const handleSignup= async (e)=>{
        e.preventDefault();
        const {name,email,password}=signupInfo;
        if(!name || !email || !password){
            return handleError('name,email and password are required')
        }
        try {
            const url = 'http://localhost:8080/auth/signup';
            console.log('📤 Sending signup info to backend:', signupInfo);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupInfo),
            });

            console.log('📥 Received raw response:', response);

            const result = await response.json();
            console.log('✅ Parsed result:', result);

            const { success, message, error } = result;

            if (success) {
                handleSuccess(message || 'Signup successful');
                setTimeout(() => navigate('/login'), 1500);
            } else if (error?.details) {
                handleError(error.details[0].message);
            } else {
                handleError(message || 'Signup failed');
            }
        } catch (err) {
            console.error('❌ Error in signup request:', err);
            handleError('Something went wrong. Check console.');
         }
  }

  return (
    <div className='container'>
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
            <div>
                <label htmlFor='name'>Name</label>
                <input onChange={handleChange} type="text" name='name' autoFocus placeholder='Enter your name' value={signupInfo.name} />
            </div>
             <div>
                <label htmlFor='email'>Email</label>
                <input onChange={handleChange} type="email" name='email' autoFocus placeholder='Enter your email' value={signupInfo.email}/>
            </div>
             <div>
                <label htmlFor='password'>Password</label>
                <input onChange={handleChange} type="password" name='password' autoFocus placeholder='Enter your password' value={signupInfo.password}/>
            </div>
            <button type='submit'>Signup</button>
            <span>Already have an account ?
                <Link to='/login'>Login</Link>
            </span>
        </form>
        <ToastContainer/>
    </div>
  )
}

export default Signup
