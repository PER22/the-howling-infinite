import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import sendRequest from '../../../utilities/send-request';
import { useNavigate } from 'react-router-dom';

export default function RequestPasswordResetPage(){

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Request Password Reset');
    }, [setTitle]);   

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError]=  useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await sendRequest('/api/users/request-password-reset', 'POST', {email});
          setMessage('Password reset email sent! Check your email for further instructions.');
          setError(null);
          setTimeout(() => {
            navigate('/reset-password');
          }, 5000);
        } catch (error) {
          setError(`Error: ${error.message}`);
          setMessage(null);
        }
  };

  setTitle("Password Reset Request");

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Send Password Reset Email</button>
      </form>
      {message && <p class="success-message">{message}</p>}
      {error && <p class="error-message">{error}</p>}
    </>
  );
}