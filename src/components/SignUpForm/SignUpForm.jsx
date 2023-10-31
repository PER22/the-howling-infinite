import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { signUp } from '../../utilities/users-service';
import FeedbackMessage from '../FeedbackMessage/FeedbackMessage';

export default function SignUpForm(){
  const navigate = useNavigate();
  const [formData, setFormData] = useState ({
    name: '',
    username: '',
    email: '',
    password: '',
    confirm: '',
    error: ''
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const form = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      // The promise returned by the signUp service method
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      await signUp(form);
      // Update user state with user
      navigate('/verification-notice');
    } catch(err) {
      // Invalid signup
      // console.log(err);
      setFormData((prevState) => ({
        ...prevState,
        error: 'Sign Up Failed - Try Again',
      }));
    }
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      error: name === 'confirm' && prevState.password !== value ? 'Passwords do not match' : '',
    }));
  };
  

  
  return (
    <Card className="info-card">
      <CardContent>
        <form autoComplete="off" onSubmit={handleSubmit}>

          <Typography variant="h6">Name</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <Typography variant="h6">Username</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <Typography variant="h6">Email</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
          />

          <Typography variant="h6">Confirm</Typography>
          <TextField
            fullWidth
            margin="normal"
            type="password"
            name="confirm"
            value={formData.confirm}
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
            disabled={formData.password !== formData.confirm}
          >
            Sign Up
          </Button>
        </form>
      </CardContent>
      <FeedbackMessage error={formData.error} message={message} />
    </Card>
  );
}
