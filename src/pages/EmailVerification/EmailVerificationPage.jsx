import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { verifyEmail } from '../../utilities/users-service';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';

const EmailVerificationPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function sendVerificationRequest() {
      // Function to get the token from query parameters
      const query = new URLSearchParams(location.search);
      const token = query.get('token');
      // Send the token to the backend for verification
      try {
        const response = await verifyEmail(token);
        if (!response.error) {
          setIsVerified(true);
          setTimeout(() => { navigate('/auth'); }, 5000);
        }
        else { setError(response.error); }
      } catch (err) {
        setError("Error verifying email.")
        console.log("Error verifying email.");
      }
    }
    sendVerificationRequest();
  }, [location.search, navigate]);

  return (
    <div>
      {isVerified && <p>Email verification successful! You may now log in.</p>}
      <FeedbackMessage error={error} message={message}/>
    </div>
  );
};

export default EmailVerificationPage;
