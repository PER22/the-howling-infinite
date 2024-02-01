//AuthPage.jsx:
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import LoginForm from '../../../components/LoginForm/LoginForm';
import SignUpForm from '../../../components/SignUpForm/SignUpForm';

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  
  const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        if(showLogin ){setTitle("Log In");}
        else{setTitle("Sign Up");} 
    }, [showLogin, setTitle]);

    const navigate = useNavigate();
  
    return (
      <Container className="auth-page" maxWidth="sm">
        {showLogin ? <LoginForm /> : <SignUpForm />}
        
        <Typography align="center" style={{ margin: '1rem 0' }}>
          <Button color="primary" variant='contained' onClick={() => setShowLogin(!showLogin)} sx={{ marginTop: '1rem',backgroundColor: 'dark-yellow', color: 'white' }}>
            {showLogin ? 'Sign Up Instead?' : 'Log In Instead?'}
          </Button>
        </Typography>
{showLogin && (
        <Typography align="center" style={{ margin: '1rem 0' }}>
          <Button variant='contained' onClick={()=>{navigate("/request-password-reset");}} sx={{marginTop: '1rem',backgroundColor: '#FF5733', color: 'white' }}>
            Reset Password
          </Button>
        </Typography>)
        }
      </Container>
    );
}