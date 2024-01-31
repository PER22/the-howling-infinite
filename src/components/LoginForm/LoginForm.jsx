//LoginForm.jsx:
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { useLoggedInUser } from '../LoggedInUserContext/LoggedInUserContext';
import * as usersService from '../../utilities/users-service';
import FeedbackMessage from '../FeedbackMessage/FeedbackMessage';
import IndeterminateLoadingSpinner from '../Loading/IndeterminateLoadingSpinner';

export default function LoginForm() {
  const navigate = useNavigate();
  const { setLoggedInUser } = useLoggedInUser();
  

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      setLoading(true);
      const user = await usersService.login(credentials);
      if (!user.error) {
        setLoggedInUser(user);
        setTimeout( () => {setLoading(false); navigate('/');}, 400);
        
      } else {
        console.log("user.error: ", user.error)
        setError(user.error);
        setLoading(false);
      }
      
    } catch (err) {
      // Check for the specific error messages and set the error state accordingly
      setError('Log In Failed - Try Again');
    }
  }


  return (
    <Card className="info-card">
      <CardContent>
        <form autoComplete="on" onSubmit={handleSubmit}>
          
          <Typography variant="h6">Email</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="text"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <Typography variant="h6">Password</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <Button
            className="auth-submit-button"
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
          >
            Log In
          </Button>
          {loading && <IndeterminateLoadingSpinner/>}
        </form>
      </CardContent>
      <FeedbackMessage error={error} message={null} />
    </Card>
  );
}