import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { verifyEmail } from '../../utilities/users-service';

const EmailVerificationPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function sendVerificationRequest(){
    // Function to get the token from query parameters
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    // Send the token to the backend for verification
    try{
        await verifyEmail(token);
        navigate('/auth');
        //TODO: navigate to homepage
    }catch(err){
        console.log("Error verifying email.");
    }
    }
    sendVerificationRequest();   
  }, [location.search, navigate]);

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
