import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import sendRequest from '../../utilities/send-request';

const EmailVerificationPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function sendVerificationRequest(){
    // Function to get the token from query parameters
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    // Send the token to the backend for verification
    try{
        const data = await sendRequest('/api/users/verify-email', 'POST', {token});
        if (data) {
            setIsVerified(true);
            localStorage.setItem('token', data);
        }
        //TODO: navigate to homepage
    }catch(err){
        console.log("Error verifying email.");
    }
    }
    sendVerificationRequest();   
  }, [location.search]);

  return (
    <div>
      {isVerified ? (
        <p>Email verification successful! You may now log in.</p>
      ) : (
        <p>Verifying your email, please wait...</p>
      )}
    </div>
  );
};

export default EmailVerificationPage;