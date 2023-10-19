//AuthPage.jsx:
import { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import LoginForm from '../../../components/LoginForm/LoginForm';
import SignUpForm from '../../../components/SignUpForm/SignUpForm';
import './AuthPage.css'

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  
  const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        if(showLogin ){setTitle("Log In");}
        else{setTitle("Sign Up");} 
    }, [showLogin, setTitle]);
  
  return (
    <>
      <main className="auth-page">
        {showLogin ? <LoginForm/> : <SignUpForm/>}
        <h3 className="toggle-login" onClick={() => setShowLogin(!showLogin)}>{showLogin ? 'Sign Up Instead?' : 'Log In Instead?'}</h3>
      </main>
    </>
  );
}