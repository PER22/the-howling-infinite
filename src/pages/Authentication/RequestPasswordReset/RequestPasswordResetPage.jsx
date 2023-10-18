import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useNavigate } from 'react-router-dom';
import FeedbackMessage from '../../../components/FeedbackMessage/FeedbackMessage';
import { requestPasswordReset } from '../../../utilities/users-api';

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
          await requestPasswordReset(email);
          setMessage('Password reset email sent! Check your email for further instructions.');
          setError(null);
          setTimeout(() => {
            navigate('/reset-password');
          }, 5000);
        } catch (error) {
          setError(error.message);
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
      <FeedbackMessage error={error} message={message}/>
    </>
  );
}