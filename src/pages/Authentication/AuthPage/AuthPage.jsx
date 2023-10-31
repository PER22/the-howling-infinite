//AuthPage.jsx:
import { useState, useEffect, useContext } from 'react';
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
  
    return (
      <Container className="auth-page" maxWidth="sm">
        {showLogin ? <LoginForm /> : <SignUpForm />}
        
        <Typography align="center" style={{ margin: '1rem 0' }}>
          <Button color="primary" variant='contained' onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? 'Sign Up Instead?' : 'Log In Instead?'}
          </Button>
        </Typography>
{showLogin && (
        <Typography align="center" style={{ margin: '1rem 0' }}>
          <Button color="primary" variant='contained' onClick={() => setShowLogin(!showLogin)}>
            Reset Password
          </Button>
        </Typography>)
        }
      </Container>
    );
}