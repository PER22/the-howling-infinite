import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { TitleContext } from "../../../components/TitleBar/TitleContext";
import { resetPassword } from "../../../utilities/users-api";
import FeedbackMessage from "../../../components/FeedbackMessage/FeedbackMessage";


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
    
export default function PerformPasswordResetPage() {
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Enter New Password');
    }, [setTitle]);

    let query = useQuery();
    useEffect(() => {
        setToken(query.get('token'));
    }, [query]);

    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        try{
            const response = await resetPassword(token,password);
            if(response){
                setMessage("Password reset successfully.");
            }
        }catch(err){
            setError(err.message);
        }
    }

    return (
        <>
          <form onSubmit={handlePasswordReset}>
            <label>
              New Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm New Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Reset Password</button>
          </form>
          <FeedbackMessage error={error} message={message}/>
        </>
      );
}