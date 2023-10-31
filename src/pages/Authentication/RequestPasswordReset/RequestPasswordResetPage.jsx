import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Card, CardContent, Container, Typography } from '@mui/material';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useNavigate } from 'react-router-dom';
import FeedbackMessage from '../../../components/FeedbackMessage/FeedbackMessage';
import { requestPasswordReset } from '../../../utilities/users-api';

export default function RequestPasswordResetPage() {

  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle('Request Password Reset');
  }, [setTitle]);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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

  return (
    <>
    <Container className="auth-page" maxWidth="sm">
      <Card className="info-card">
        <CardContent>
          <Typography>Enter the email address you used to register, then check your inbox for a password reset link.</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem' }}>
              Send Password Reset Email
            </Button>
          </form>
        </CardContent>
      </Card>
      <FeedbackMessage error={error} message={message} />
      </Container>
    </>
  );
}