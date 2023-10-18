import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      navigate('/');
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
    <>
      <div className="info-card">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          /><br/>

          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          /><br/>

          <label>Email</label><br/>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          /><br/>

          <label>Password</label><br/>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          /><br/>

          <label>Confirm</label><br/>
          <input 
            type="password" 
            name="confirm" 
            value={formData.confirm} 
            onChange={handleChange} 
            required 
          /><br/>

          <button 
            className="auth-submit-button" 
            type="submit" 
            disabled={formData.password !== formData.confirm}
          >Sign Up</button>
        </form>
      </div>
      <FeedbackMessage error={formData.error} message={message}/>
    </>
  );
}
