//LoginForm.jsx:
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import * as usersService from '../../utilities/users-service';

export default function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      const user = await usersService.login(credentials);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.log(err.message);
      // Check for the specific error messages and set the error state accordingly
      if (err.message === 'sendRequest failed: {"error":"Email address not verified."}') {
        setError("You need to verify your email before you can log in. Check your inbox.");
      } else {
        setError('Log In Failed - Try Again');
      }
    }
  }
  

  return (
    <>
      <div className="info-card">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <label>Email</label><br/>
          <input type="text" name="email" value={credentials.email} onChange={handleChange} required /><br/>
          <label>Password</label><br/>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} required /><br/>
          <button className="auth-submit-button" type="submit">Log In</button>
        </form>
      </div>
      <p className="error-message">&nbsp;{error}</p>
    </>
  );
}