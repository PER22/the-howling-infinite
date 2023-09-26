import { useState } from 'react';
import LoginForm from '../../../components/LoginForm/LoginForm';
import SignUpForm from '../../../components/SignUpForm/SignUpForm';
import TitleBar from '../../../components/TitleBar/TitleBar';
import './AuthPage.css'

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <TitleBar title={showLogin ? "Log In" : "Sign Up"}/>
      <main className="auth-page">
        {showLogin ? <LoginForm setUser={setUser} /> : <SignUpForm setUser={setUser} />}
        <h3 className="toggle-login" onClick={() => setShowLogin(!showLogin)}>{showLogin ? 'Sign Up Instead?' : 'Log In Instead?'}</h3>
      </main>
    </>
  );
}